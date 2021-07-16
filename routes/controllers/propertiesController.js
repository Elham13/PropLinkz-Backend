import Properties from "../../models/propertyModel.js";

export const getAllProperties = async (req, res) => {
  try {
    const props = await Properties.find({}).limit(10);
    res.status(200).json(props);
  } catch (error) {
    res.status(500).json({ Fail: error.message });
  }
};

export const getFilteredProps = async (req, res) => {
  const { pageNumber, keyword } = req.query;
  // console.log(req.query);
  const pageSize = 10;
  const page = Number(pageNumber) || 1;

  const key = keyword
    ? {
        $or: [
          {
            purpose: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            location: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      }
    : {};

  try {
    const count = await Properties.countDocuments({ ...key });
    const properties = await Properties.find({ ...key })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

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
