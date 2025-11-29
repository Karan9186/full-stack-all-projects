import e from "express";
import { StoreController } from "../controller/store.controller.js";
import { Store } from "../model/store.schema.js";

const storeRoutes = e.Router();

storeRoutes.post("/save", async (req, res) => {
  try {
    const { name, radius, lat, long } = req.body;
    if (!name || !radius || !lat || !long) {
      return res.send({ message: "something is missing" });
    }
    const store = new Store({ name, radius, lat, long });
    const saved = await store.save();
    return res.send({ message: "saved succesfully", saved });
  } catch (err) {
    console.log(err);
  }
});

storeRoutes.post("/get", async (req, res) => {
  try {
    const { radius, lat, long, currLat, currLong } = req.body;
    // if (!radius || !lat || !long || !currLat || !currLong) {
    //   return res.send({ message: "something is missing" });
    // }
    // $near: {
    //   $geometry: {
    //      type: "Point" ,
    //      coordinates: [ <longitude> , <latitude> ]
    //   },
    //   $maxDistance: <distance in meters>,
    //   $minDistance: <distance in meters>
    // }
    console.log("the re?????", radius, lat, long);
    const store = await Store.aggregate([
      {
        $geoNear: {
          near: {
            lat:parseFloat(lat),
            long:parseFloat(long),
          },
          distanceField: "distance",
          $maxDistance: parseFloat(radius) * 1000,
          $minDistance: parseFloat(radius) * 1000,
          spherical: true,
        },
      },
    ]);
    res.send(store);
  } catch (err) {
    console.log(err);
  }
});

export default storeRoutes;
