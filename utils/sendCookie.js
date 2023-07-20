export const sendCookie = (user = {}, statusCode, res) => {
    //const token = user.generateToken();

    const options = {
    
        httpOnly: true
    }

    res.status(statusCode).cookie('token', "token", options).json({
        success: true,
        user,
    });
}