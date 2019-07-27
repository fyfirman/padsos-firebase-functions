const { db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateRegisterData, validateLoginData } = require('../util/fbAuth');

exports.register = (request, response) => {
	const newUser = {
		email: request.body.email,
		password: request.body.password,
		confirmPassword: request.body.confirmPassword,
		handle: request.body.handle
	};

	// Validate Data
	const { valid, errors } = validateRegisterData(newUser);
	if (!valid) {
		return response.status(400).json(errors);
	}

	let token, userId;
	db.doc(`/users/${newUser.handle}`)
		.get()
		.then(document => {
			if (document.exists) {
				return response
					.status(400)
					.json({ handle: 'this handle is already taken' });
			} else {
				return firebase
					.auth()
					.createUserWithEmailAndPassword(
						newUser.email,
						newUser.password
					);
			}
		})
		.then(data => {
			userId = data.user.uid;
			return data.user.getIdToken();
		})
		.then(idToken => {
			token = idToken;
			const userCredentials = {
				handle: newUser.handle,
				email: newUser.email,
				createAt: new Date().toISOString(),
				userId
			};
			return db.doc(`/users/${newUser.handle}`).set(userCredentials);
		})
		.then(data => {
			return response.status(201).json({ token });
		})
		.catch(err => {
			console.error(err);
			if (err.code == 'auth/email-already-in-use') {
				return response
					.status(400)
					.json({ email: 'Email is already in use' });
			}
			return response.status(500).json({ error: err.code });
		});
};

exports.login = (request, response) => {
	const user = {
		email: request.body.email,
		password: request.body.password
	};

	// Validate Data
	const { valid, errors } = validateLoginData(user);
	if (!valid) {
		return response.status(400).json(errors);
	}

	firebase
		.then(token => {
			return response.json({ token });
		})
		.catch(err => {
			console.error(err);
			if (err.code === 'auth/user-not-found') {
				return response.status(403).json({
					general:
						'Wrong credential. Please check your email/password'
				});
			}
			return response.status(500).json({ error: err.code });
		});
};
