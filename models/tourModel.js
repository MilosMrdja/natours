const mongoose = require('mongoose');
const slugify = require('slugify');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour must have less or equal then 40 character'],
      minLength: [10, 'A tour must have more or equal then 10 character'],
      //validate: [validator.isAlpha, 'Name must only contain character'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty can be easu, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5'],
      set: (value) => Math.round(value * 10) / 10, // 4.66666 - 46.6666 => 47 / 10 = 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (value) {
          // This only points to current doc on NEW document creation
          return value < this.price;
        },
        message: 'Discount ({VALUE}) can not be greater then price',
      },
    },
    summary: {
      type: String,
      trim: true, // remove white space from begin and end
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], // longitude - median, latitude - ekvator
      adress: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        adress: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

toursSchema.index({ price: 1 });
toursSchema.index({ ratingsAverage: -1 });
toursSchema.index({ startLocation: '2dsphere' });

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // field in other model weher is tour beeing sotred
  localField: '_id', // Primary key
});

// DOCUMENT MIDDLAWARE runs before .save() and .create()
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// toursSchema.pre('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
toursSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// // AGGREGATION MIDDLEWARE
// toursSchema.pre('aggregate', function (next) {
//   this.pipelane().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'role name photo', // id is default
  });
  next();
});
const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
