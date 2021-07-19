import Properties from "../../models/propertyModel.js";

export const getAllProperties = async (req, res) => {
  try {
    const props = await Properties.find({}).limit(10);
    res.status(200).json(props);
  } catch (error) {
    res.status(500).json({ Fail: error.message });
  }
};

export const postFilteredProps = async (req, res) => {
  const {
    pageNumber,
    purpose,
    locations,
    propType,
    budgetRange,
    noOfBedrooms,
  } = req.body;

  // console.log("Body: ", req.body);

  const pageSize = 10;
  const page = Number(pageNumber) || 1;

  var and = {};
  if (purpose) {
    and["purpose"] = {
      $regex: purpose,
      $options: "i",
    };
  }
  if (locations.length > 0) {
    and["location"] = {
      $regex: locations[0],
      $options: "i",
    };
  }
  if (propType) {
    and["propType"] = {
      $regex: propType,
      $options: "i",
    };
  }
  if (noOfBedrooms) {
    and["bedrooms"] = { $eq: noOfBedrooms };
  }

  // console.log("and: ", and);
  let searchQuery = null;

  if (budgetRange.length) {
    if (purpose === "Rent") {
      // console.log("Rent");
      searchQuery = {
        $and: [
          {
            ...and,
            "rentDetails.rent": { $gt: budgetRange[0] },
            "rentDetails.rent": { $lt: budgetRange[1] },
          },
        ],
      };
    }
    if (purpose === "Sale") {
      // console.log("Sales");
      searchQuery = {
        $and: [
          {
            ...and,
            "saleDetaails.expectedPrice": { $gt: budgetRange[0] },
            "saleDetaails.expectedPrice": { $lt: budgetRange[1] },
          },
        ],
      };
    }
  } else {
    // console.log("Others");
    searchQuery = { $and: [and] };
  }

  // console.log("Query: ", searchQuery);

  try {
    const count = await Properties.countDocuments({ ...searchQuery });
    const properties = await Properties.find({ ...searchQuery })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // console.log("properties: ", properties, "\nCount: ", count);

    res
      .status(200)
      .json({ properties, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ Fail: error.message });
  }
};

export const addProperty = async (req, res) => {
  try {
    const prop = await Properties.create({
      ...req.body,
      createorId: req.user._id,
      creatorName: req.user.name,
      creatorMobile: req.user.mobile,
    });
    res.status(201).json({ Success: "Property successfully created" });
  } catch (error) {
    res.status(500).json({ Fail: error.message });
  }
};
