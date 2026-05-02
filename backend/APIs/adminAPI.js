import exp from 'express'
import { UserModel } from '../models/userModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
export const adminApp = exp.Router()

// Read all non-admin users (USER + AUTHOR)
adminApp.get('/users', verifyToken('ADMIN'), async (req, res) => {
	try {
		const usersAndAuthors = await UserModel.find(
			{ role: { $in: ['USER', 'AUTHOR'] } },
			{ firstName: 1, lastName: 1, email: 1, role: 1, isUserActive: 1 }
		).lean()

		res.status(200).json({
			message: 'Users and authors',
			payload: usersAndAuthors
		})
	} catch (err) {
		res.status(500).json({ message: 'Error in fetching users', error: err.message })
	}
})

// Block or activate a user/author account
adminApp.patch('/users/status', verifyToken('ADMIN'), async (req, res) => {
	try {
		const { userId, isUserActive } = req.body

		if (typeof isUserActive !== 'boolean') {
			return res.status(400).json({ message: 'isUserActive must be boolean' })
		}

		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: userId, role: { $in: ['USER', 'AUTHOR'] } },
			{ $set: { isUserActive } },
			{ new: true, runValidators: true, projection: { firstName: 1, lastName: 1, email: 1, role: 1, isUserActive: 1 } }
		).lean()

		if (!updatedUser) {
			return res.status(404).json({ message: 'User/author not found' })
		}

		res.status(200).json({ message: 'User status updated', payload: updatedUser })
	} catch (err) {
		res.status(500).json({ message: 'Error in updating status', error: err.message })
	}
})

