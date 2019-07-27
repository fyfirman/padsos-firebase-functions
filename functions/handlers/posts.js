const { admin } = require('../util/admin');

exports.getAllPosts = (request, response) => {
	admin
		.firestore()
		.collection('posts')
		.orderBy('createAt', 'desc')
		.get()
		.then(data => {
			let posts = [];
			data.forEach(document => {
				posts.push({
					postId: document.id,
					body: document.data().body,
					userHandle: document.data().userHandle,
					createAt: document.data().createAt
				});
			});
			return response.json(posts);
		})
		.catch(err => console.error(err));
};

exports.pushOnePost = (request, response) => {
	const newPost = {
		body: request.body.body,
		userHandle: request.user.handle,
		createAt: new Date().toISOString()
	};

	admin
		.firestore()
		.collection('posts')
		.add(newPost)
		.then(document => {
			response.json({
				message: `document ${document.id} created successfully`
			});
		})
		.catch(err => {
			response.status(500).json({ error: `something went wrong` });
			console.error(err);
		});
};
