// 创建这个文件的话，本王推荐用eslint --init创建
module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
    ],
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2018
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": 0,
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-trailing-spaces": [
            "error",
            { "skipBlankLines": true }
        ],
        'no-prototype-builtins': 0,
        'no-debugger': 2,
        'no-console': 0,
    }
};