const localStrategy = require("passport-local").Strategy
const sequelize = require('../database')
const bcrypt = require('bcrypt')
const Usuario = require('../Models/Usuario')

module.exports = function(passport) {

    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {
        // Buscar o usuário pelo e-mail no banco de dados
        Usuario.findOne({ where: { email: email } }).then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: "Essa conta não existe" });
            }

            // Comparar a senha com o hash armazenado no banco
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if (batem) {
                    return done(null, usuario); // Retornar o usuário encontrado
                } else {
                    return done(null, false, { message: "Senha Incorreta" });
                }
            });
        }).catch(err => {
            return done(err); // Retornar erro caso ocorra
        });
    }));

    // Serializar o usuário para a sessão
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    // Desserializar o usuário pela ID armazenada na sessão
    passport.deserializeUser((id, done) => {
        Usuario.findByPk(id).then((usuario) => {
            done(null, usuario);
        }).catch(err => {
            done(err);
        });
    });

}