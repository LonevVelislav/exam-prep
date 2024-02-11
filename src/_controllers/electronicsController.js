const router = require("express").Router();
const Electronic = require("../models/Electronic");
const { extractErrorMsg } = require("../utils/errorHanler");
const { isAuth, ownerProtect } = require("../middlewares/authMiddlewares");

router.get("/", async (req, res) => {
  const electronics = await Electronic.find().lean();

  res.render("catalog", { electronics });
});

router.get("/create", isAuth, async (req, res) => {
  res.render("create");
});

router.post("/create", isAuth, async (req, res) => {
  const { name, type, production, exploitation, damages, image, price, description } = req.body;

  try {
    await Electronic.create({
      name,
      type,
      production: Number(production),
      exploitation: Number(exploitation),
      damages,
      image,
      price: Number(price),
      description,
      owner: req.user,
    });
    res.redirect("/electronics");
  } catch (err) {
    const errMessage = extractErrorMsg(err);

    res.status(404).render("create", {
      errMessage,
      name,
      type,
      production,
      exploitation,
      damages,
      image,
      price,
      description,
    });
  }
});

router.get("/:id/details", async (req, res) => {
  const { id } = req.params;
  const electronic = await Electronic.findById(id).populate("buyingList").lean();
  const isOwner = electronic.owner.toString() === req.user?._id;
  const isBought = electronic.buyingList.some((el) => el._id.toString() === req.user?._id);

  res.render("details", { electronic, isOwner, isBought });
});

router.get("/:id/edit", isAuth, ownerProtect, async (req, res) => {
  const { id } = req.params;
  const electronic = await Electronic.findById(id).lean();

  res.render("edit", { electronic });
});

router.post("/:id/edit", isAuth, ownerProtect, async (req, res) => {
  const { id } = req.params;
  const { name, type, production, exploitation, damages, image, price, description } = req.body;
  const electronic = {
    name,
    type,
    production,
    exploitation,
    damages,
    image,
    price,
    description,
  };
  try {
    await Electronic.findByIdAndUpdate(
      id,
      {
        name,
        type,
        production: Number(production),
        exploitation: Number(exploitation),
        damages,
        image,
        price: Number(price),
        description,
      },
      { runValidators: true }
    );
    res.redirect(`/electronics/${id}/details`);
  } catch (err) {
    const errMessage = extractErrorMsg(err);
    res.status(404).render("edit", { errMessage, electronic });
  }
});

router.get("/:id/delete", isAuth, ownerProtect, async (req, res) => {
  const { id } = req.params;
  await Electronic.findByIdAndDelete(id);

  res.redirect("/electronics");
});

router.get("/:id/buy", isAuth, async (req, res) => {
  const { id } = req.params;
  const electronic = await Electronic.findById(id).populate("buyingList");

  //check if user is the owner of the product or user has already bought this item
  if (
    electronic.owner.toString() === req.user?._id ||
    electronic.buyingList.some((el) => el._id.toString() === req.user?._id)
  ) {
    res.status(404).redirect("/404");
    return;
  }
  electronic.buyingList.push(req.user);
  await electronic.save();
  res.redirect(`/electronics/${id}/details`);
});

router.get("/search", isAuth, async (req, res) => {
  const { name, type } = req.query;
  const data = await Electronic.find().lean();
  const options = {};
  if (name) {
    const filtered = data
      .filter((el) => el.name.toLowerCase().includes(name.toLowerCase()))
      .map((e) => e.name);
    options.name = { $in: filtered };
  }
  if (type) {
    const filtered = data
      .filter((el) => el.type.toLowerCase().includes(type.toLowerCase()))
      .map((e) => e.type);
    options.type = { $in: filtered };
  }
  const electronics = await Electronic.find(options).lean();

  res.render("search", { electronics });
});
module.exports = router;
