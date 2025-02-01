import express from 'express';
import os from 'os';
import dotenv from 'dotenv';
import { corsError } from './middleware/error-handlers/cors-error.js';
import cluster from 'cluster';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { centralError } from './middleware/error-handlers/central-error.js';
import appRoutes from './routes/appRoutes.js';
import sequelize from './utilities/database.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const cpu = os.cpus().length;
const app = express();
const port = process.env.PORT || 8000;

app.use(corsError);
app.get("/", (req, res) => {
    return res.send("Server health is Good");
});

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < cpu; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork(); 
    });
} else {
    console.log(`Worker ${process.pid} started`);

    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            let dir = file.fieldname === "banner" ? "./banners" : "./images";
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname.replace(/\s/g, '-'));
        }
    });

    const fileFilter = (req, file, cb) => {
        if (["image/jpg", "image/png", "image/jpeg", "application/pdf"].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    const __dirname = path.resolve();
    app.use(express.urlencoded({ extended: true, limit: '200mb' }));
    app.use(express.json({ limit: '200mb' }));
    app.use(express.static(path.join(__dirname, "public")));

    app.use(multer({ storage: fileStorage, fileFilter }).fields([
        { name: 'image', maxCount: 5 },
        { name: 'banner', maxCount: 5 }
    ]));

    app.use('/app', appRoutes);
    app.use('/auth',authRoutes)
    app.use(helmet());
    app.use(compression());
    app.use(centralError);



    sequelize.sync().then(()=>{
        app.listen(port, () => {
            console.log(`Worker ${process.pid} - Server running at http://localhost:${port}`);
        });
    }).catch((err)=>{
        console.log("Error",err);
    })
}
