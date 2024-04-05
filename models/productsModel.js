// const mongoose = require("mongoose");
// const objectId = mongoose.Types.ObjectId;
// const productSchema = mongoose.Schema({
//   vendorId: {
//     type: objectId,
//     ref: "user",
//   },
//   documents: {
//     panCard: {
//       type: String,
//     },
//     panImage: {
//       type: String,
//     },
//     aadharCard: {
//       type: String,
//     },
//     frontSide: {
//       type: String,
//     },
//     backSide: {
//       type: String,
//     },
//   },
//   bankDetails: {
//     panNumber: {
//       type: String,
//       required: true,
//     },
//     bankName: {
//       type: String,
//       required: true,
//     },
//     branchName: {
//       type: String,
//       required: true,
//     },
//     accountHolder: {
//       type: String,
//       required: true,
//     },
//     accountNumber: {
//       type: String,
//       required: true,
//     },
//     confirmAccount: {
//       type: String,
//       required: true,
//     },
//     ifscCode: {
//       type: String,
//       required: true,
//     },
//   },
//   companyDetails: {
//     companyName: {
//       type: String,
//       required: true,
//     },
//     ownerName: {
//       type: String,
//       required: true,
//     },
//     ownerNumber: {
//       type: String,
//       required: true,
//     },
//     supportNumber: {
//       type: String,
//       required: true,
//     },
//     regNumber: {
//       type: String,
//       required: true,
//     },
//     gstNumber: {
//       type: String,
//       required: true,
//     },
//     ownerEmail: {
//       type: String,
//       required: true,
//     },
//     typeOfProduct: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//   },
//   // review: [
//   //   {
//   //     userId: {
//   //       type: objectId,
//   //       ref: "user",
//   //     },
//   //     rating: {
//   //       type: Number,
//   //       default: 0,
//   //     },
//   //   },
//   // ],
//   // totalRating: {
//   //   type: Number,
//   //   default: 0,
//   // },
//   // avgStarRating: {
//   //   type: Number,
//   //   default: 0,
//   // },
//   // productImage: {
//   //   type: Array,
//   //   default: "",
//   // },
//   // price: {
//   //   type: Number,
//   //   default: 0,
//   // },
//   // offerPrice: {
//   //   type: Number,
//   //   default: 0,
//   // },
//   // discount: {
//   //   type: Number,
//   //   default: 0,
//   // },
//   // brand: {
//   //   type: String,
//   //   default: "",
//   // },
//   // capacity: {
//   //   type: String,
//   //   default: "",
//   // },
//   // features: [
//   //   {
//   //     type: String,
//   //     default: "",
//   //   },
//   // ],
//   // colour: {
//   //   type: String,
//   //   default: "",
//   // },
//   // deliveryCharges: {
//   //   type: String,
//   //   default: "",
//   // },
//   // availableStock: {
//   //   type: String,
//   //   default: "",
//   // },
//   // warranty: {
//   //   type: String,
//   //   default: "",
//   // },
//   // replacement: {
//   //   type: String,
//   //   default: "",
//   // },
// });
// const productModel = mongoose.model("product", productSchema);

// module.exports = productModel;

const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const productSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the User model
      required: true,
    },
    name: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    aadharNumber: {
      type: String,
    },
    companyName: {
      type: String,
    },
    ownerName: {
      type: String,
    },
    ownerNumber: {
      type: String,
    },
    supportNumber: {
      type: String,
    },
    regNumber: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    ownerEmail: {
      type: String,
    },
    typeOfProduct: {
      type: String,
    },
    address: {
      type: String,
    },
    frontSide: {
      type: String,
    },
    backSide: {
      type: String,
    },
    panSide: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    bankName: {
      type: String,
    },
    branchName: {
      type: String,
    },
    accountHolder: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    confirmAccount: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    images: {
      type: [String],
      required: true,
    },
    productName: {
      type: String,
    },
    brandName: {
      type: String,
    },
    description: {
      type: String,
    },
    capacity: {
      type: String,
    },
    rating: {
      type: String,
    },
    price: {
      type: String,
    },
    discount: {
      type: String,
    },
    stock: {
      type: String,
    },
    deliveryCharge: {
      type: String,
    },
    warranty: {
      type: String,
    },
    replacement: {
      type: String,
    },
    reviews: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", // Reference to the User model
          },
          rating: {
            type: Number,
            default: 0,
          },
        },
      ],
      default: [],
    },


    openingTime: {
      type: String,
      default: "09:00 AM", // Default opening time
    },

    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0], // Default coordinates
        required: false, // Location is optional
      },
      source: {
        type: {
          type: String,
          default: "Point",
        },
        coordinates: {
          type: [Number],
          default: [0, 0], // Default source coordinates
          required: false,
        },
      },
      destination: {
        type: {
          type: String,
          default: "Point",
        },
        coordinates: {
          type: [Number],
          default: [0, 0], // Default destination coordinates
          required: false,
        },
      },
    },
    // ... (other fields)
  }, { timestamps: true });
productSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Product", productSchema);
