var bcrypt   = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
	var Client = sequelize.define('Client',{
		email: { type: DataTypes.STRING },
		password: { type: DataTypes.STRING }
	},
	{	
		timestamps:true,
		underscored: true,
		panaroid: false,
		instanceMethods:{
			generateHash : function(password) {
	    		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
			},
			validPassword : function(password) {
			    return bcrypt.compareSync(password,this.password);
			}
		}
	});

	return Client
}
