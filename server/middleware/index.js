const admin = require('../config/firebase-config');

class Middleware{
	async decodeToken(req,res,next){
	try{
		if(req.headers && req.headers.accesstoken) {
			const token = req.headers.accesstoken;
			const decodeValue = await admin.auth().verifyIdToken(token);
			if(decodeValue){
				req.session.email = decodeValue.email;
				req.session.save((err)=>{
					if(err) next(err);
					// console.log(req.session.user);
				})
				return next();
			}
		}
		return res.status(403).json({message:"Either Token Not Received or Unauthorized Token received. Please login Again"});
	}
	catch(e){
		return res.status(400).json({message: 'Access Token Validation Failed. Please Login Again'});
	}
}

async checkAuth(req,res,next){
	if(req.session.user || req.headers.authorization === undefined){
		return next();
	}
	
	try{
		const token = req.headers.authorization.split(' ')[1];
		const decodeValue = await admin.auth().verifyIdToken(token);
		if(decodeValue){
			req.session.user = {
				email: decodeValue.email,
				name: decodeValue.name
			}
		}
	}
	catch(e){
		return res.status(400).json({message: 'Internal error'});
	}
	return next();
}

}



module.exports = new Middleware();