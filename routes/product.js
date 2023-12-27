import express from 'express'
import slugify from 'slugify'
import formidable from 'express-formidable'
import fs from 'fs'

import Product from '../models/product.js'

const router = express.Router()

// INDEX
router.get('/products', async (req, res) => {
    try {
        const all = await Product.find({})
        res.json(all)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err.message)
    }
})

// SHOW
router.get('/products/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)
        res.json(product)
    } catch (err) {
        console.log(err)
        return res.status(400).json(err.message)
    }
})

// CREATE
router.post('/products', formidable(), async (req, res) => {
    try {
        // console.log(req.fields)
        // console.log(req.files)
        const { name, description, category } = req.fields
        const { photo } = req.files

        switch (true) {
            case !name.trim():
                res.json({ error: 'Name is required!'})
            case !description.trim():
                res.json({ error: 'Description is required!'})
            case !category.trim():
                res.json({ error: 'Category is required!'})
            case photo && photo.size > 1000000:
                res.json({ error: 'Photo must be less than 1mb in size.'})
        }

        const product = new Product({ ...req.fields, slug: slugify(name) })
        if(photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save()
        res.json(product)

    } catch (err) {
        console.log(err)
        return res.status(400).json(err.message)
    }
})

// UPDATE

// DELETE

export default router