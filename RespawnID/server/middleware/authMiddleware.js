import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {

        let token;

        // check authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            // extract token
            token = req.headers.authorization.split(" ")[1];

            // verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // attach user to request
            req.user = await User.findById(decoded.id).select("-password");

            next();

        } else {

            return res.status(401).json({
                message: "Not authorized, no token"
            });

        }

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            message: "Token failed"
        });

    }
};

export default protect;