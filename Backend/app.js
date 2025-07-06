require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;

const Teacher = require("./models/teacherSchema");
const Admin = require("./models/adminSchema");
const batchRoutes = require("./routes/batch");
const teacherRoutes = require("./routes/teacher");
const subjectRoutes = require("./routes/subject");
const scheduleRoutes = require("./routes/schedule");
const apiRoutes = require("./routes/api");

const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", require("./routes/auth"));
app.use("/api/batches", batchRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/schedule", require("./routes/schedule"));
app.use("/api/schedule", scheduleRoutes);
app.use("/api", apiRoutes);

// MongoDB connection
const dburl = process.env.MONGO_URL;
main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  });
async function main() {
  await mongoose.connect(dburl);
}

// Session store
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("MongoDB session store error", err);
});

// Session middleware
app.use(
  session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport strategies
passport.use(
  "teacher",
  new LocalStrategy(async (username, password, done) => {
    try {
      const teacher = await Teacher.findOne({ ID_Name: username });
      if (!teacher) {
        return done(null, false, { message: "Incorrect username." });
      }
      const isMatch = await bcrypt.compare(password, teacher.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, teacher);
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  "admin",
  new LocalStrategy(async (username, password, done) => {
    try {
      const admin = await Admin.findOne({ name: username });
      if (!admin) {
        return done(null, false, { message: "Incorrect username." });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, admin);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, {
    id: user._id,
    type: user instanceof Teacher ? "Teacher" : "Admin",
  });
});

passport.deserializeUser(async (data, done) => {
  try {
    if (data.type === "Teacher") {
      const teacher = await Teacher.findById(data.id);
      return done(null, teacher);
    } else {
      const admin = await Admin.findById(data.id);
      return done(null, admin);
    }
  } catch (err) {
    return done(err);
  }
});

// Login route
app.post("/auth/login", (req, res, next) => {
  const { userType } = req.body;

  const callback = (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      const dashboardPath =
        userType === "admin"
          ? `/adminDash/${user._id}`
          : `/teachDash/${user._id}`;
      return res.status(200).json({
        message: "Login successful",
        dashboardPath,
        userType,
        userId: user._id,
        userName: user.name || user.ID_Name, // ✅ sends real name
      });
    });
  };

  if (userType === "teacher") {
    passport.authenticate("teacher", callback)(req, res, next);
  } else if (userType === "admin") {
    passport.authenticate("admin", callback)(req, res, next);
  } else {
    res.status(400).json({ message: "Invalid user type" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
