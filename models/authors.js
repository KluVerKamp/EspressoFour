module.exports = function(sequelize, DataTypes) {
	var Author = sequelize.define('Author',{
		name: { type: DataTypes.STRING },
		bio: { type: DataTypes.STRING }
	},
	{timestamps:true,underscored: true, panaroid: false});

	return Author
}
