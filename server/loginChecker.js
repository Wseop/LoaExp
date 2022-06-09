module.exports = {
    isLogin: function(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.send("로그인이 필요합니다.");
        }
    }
};