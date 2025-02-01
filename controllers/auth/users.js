import { validationErrorHandler } from "../../helpers/validation-error-handler.js"
import { User } from "../../model/index.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res, next) => {
    validationErrorHandler(req, next);
    const { name, phone, email, referralKey, createid, password } = req.body;
    try {
        let existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            const error = new Error("User Already Exist with this Phone Number");
            error.statusCode = 403;
            return next(error);
        }
        let sponser = await User.findOne({ where: { referralKey } });
        if (!sponser) {
            const error = new Error("Referral Id is not valid");
            error.statusCode = 403;
            return next(error);
        }
        let isCreateIdCorrect = await User.findOne({ where: { createid: createid } })
        if (isCreateIdCorrect) {
            const error = new Error("Create Id is Already Exist, Please use Different createid");
            error.statusCode = 403;
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        let userDetails = await User.create({
            name, phone, email, referralKey, createid,
            password: hashedPassword,
            isActive: false,
            isKycVerified: false,
        });

        return res.status(201).json({
            userDetails,
            message: 'User Created SuccsseFully'
        })

    } catch (error) {
          console.log("error",error);
        if (!error.statusCode) {
            
            error.statusCode = 500;
        }
        return next(error);
    }
}

export const userLogin = async (req, res, next) => {
    validationErrorHandler(req, next);
    const { userId, password } = req.body;
    try {
        const isValidUser = await User.findOne({ where: { createid: userId } });
        if (!isValidUser) {
            const error = new Error(`User Not Found with this user Id ${userId}`);
            error.statusCode = 404;
            return next(error);
        }
        let id = isValidUser.id;
        const isPasswordValid = bcrypt.compare(password, isValidUser.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid Password");
            error.statusCode = 401;
            next(error);
        }
        let token = jwt.sign({
            id,
            userId
        },
            process.env.TOKEN_SIGNING_KEY
        )

        let refreshToken = jwt.sign({
            id,
            userId
        },
            process.env.REFRESH_SIGNING_KEY
        );
        await User.update({
            token: token,
            refreshToken: refreshToken
        }, { where: { id: id } }
        );

        isValidUser.token = token;
        isValidUser.refreshToken = refreshToken;

        return res.status(200).json({
            message: "Login SuccessFull",
            userDetails: isValidUser
        })

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }
}


