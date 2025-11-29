import express from "express";
import Productdemos from "../model/product.schema.js";
import mongoose from "mongoose";

const getProduct = async (req, res) => {
  try {
    const sortName = req.query.sort;
    const sortOrder = req.query.order;

    let query = Productdemos.find();

    if (sortName) {
      query = query.sort({ [sortName]: sortOrder }).limit(req.query.limit);
    }

    const allProduct = await query.exec();
    res.json(allProduct);
  } catch (err) {
    res.json({ message: "product not found" });
  }
};

const createProduct = async (req, res) => {
  try {
    let product = new productdemos(req.body);

    await product
      .save()
      .then((doc) => {
        res.send(doc);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } catch {
    res.status(500).json({ message: "product is not created" });
  }
};
let allFunction = [getProduct, createProduct];
export default allFunction;
