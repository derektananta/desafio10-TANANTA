import { Router } from "express";
import { uploader } from "../utils.js";
import { userModel } from "../dao/models/user.model.js";


export const router = Router()

router.post("/premium/:uid", async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        if (user.rol === 'user') {
            const requiredDocuments = ['identification', 'bank_statement', 'proof_of_residence'];

            const missingDocuments = requiredDocuments.filter(doc => !user.documents.some(d => d.ref.includes(doc)));

            if (missingDocuments.length > 0) {
                return res.status(400).json({ status: 'error', message: 'Missing required documents', missingDocuments });
            }
        }

        user.rol = user.rol === 'user' ? 'premium' : 'user';

        await user.save();

        res.json({ status: 'success', message: 'User rol updated successfully', user });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

router.post("/:uid/documents", uploader.single("file"), async (req, res) => {
    try {
        const session = req.session.user;
        const file = req.file;
        const user = await userModel.findById(req.user._id);
        if (!session) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        user.documents.push({ name: file.originalname, ref: file.path })

        await user.save();

        if (!file) {
            return res.status(400).send({ status: "Error", error: "Could not save the image" });
        }

        res.json({ status: 'success', message: 'User uploaded image successfully', user });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

