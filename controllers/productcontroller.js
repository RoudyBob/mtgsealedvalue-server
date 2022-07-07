const { Router } = require("express");
const { Product } = require("../models");
const validateSession = require("../middleware/validate-session");
const router = Router();

// This endpoint will create a new product entry for the current user
router.post('/', validateSession, function (req, res) {
    Product.create({
        productid: req.body.product.productid,
        productname: req.body.product.productname,
        datepurchased: req.body.product.datepurchased,
        purchaseprice: req.body.product.purchaseprice,
        purchasetax: req.body.product.purchasetax,
        purchaseshipping: req.body.product.purchaseshipping,
        notes: req.body.product.notes,
        userId: req.user.id
    })
    .then(product => res.status(200).json({ message: 'Product Successfully Added', product }))
    .catch(err => res.status(500).json({ error: err }));
});

// This endpoint will update a product entry based on an ID
router.put('/:id', validateSession, function (req, res) {
    if (req.user.id === req.body.product.userId) {
        const updateProduct = {
            productid: req.body.product.productid,
            productname: req.body.product.productname,
            datepurchased: req.body.product.datepurchased,
            purchaseprice: req.body.product.purchaseprice,
            purchasetax: req.body.product.purchasetax,
            purchaseshipping: req.body.product.purchaseshipping,
            notes: req.body.product.notes,
            userId: req.body.product.userId
        };

        const query = { where: { id: req.params.id, userId: req.user.id }};

        Product.update(updateProduct, query)
        .then((rowsAffected) => res.status(200).json({ message: `${rowsAffected} entries updated.` }))
        .catch((err) => res.status(500).json({ error: err }));
    } else {
        return res.status(403).json({ error: "Access Denied." })
    }
});

// This endpoint will list all of the products for the current user
router.get('/mine', validateSession, function (req, res) {
    const query = {
        where: {userId: req.user.id}
    }

    Product.findAll(query)
        .then((products) => res.status(200).json(products))
        .catch((err) => res.status(500).json({ error: err }));
});

// This endpoint deletes a specific product entry by ID
// Only should allow deletions if the plan belongs to the current user
router.delete('/:id', validateSession, function (req, res) {
    const query = {
        where: {id: req.params.id, userId: req.user.id}
    }

    Product.destroy(query)
        .then((rowsAffected) => {
            if (rowsAffected > 0) {
                res.status(200).json({ message: `${rowsAffected} entries deleted.` })
            } else {
                res.status(200).json({ error: `No entries deleted. `})
            }
        })
        .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;