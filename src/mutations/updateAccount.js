import SimpleSchema from "simpl-schema";
import ReactionError from "@reactioncommerce/reaction-error";
import CurrencyDefinitions from "@reactioncommerce/api-utils/CurrencyDefinitions.js";
import { Account } from "../simpleSchemas.js";

const inputSchema = new SimpleSchema({
  accountId: {
    type: String,
    optional: true,
  },
  bio: {
    type: String,
    optional: true,
  },
  currencyCode: {
    type: String,
    optional: true,
  },
  firstName: {
    type: String,
    optional: true,
  },
  language: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
    optional: true,
  },
  note: {
    type: String,
    optional: true,
  },
  picture: {
    type: String,
    optional: true,
  },
  username: {
    type: String,
    optional: true,
  },
  isDeleted: {
    type: Boolean,
    optional: true,
  },
  languageAccount: {
    type: String,
    optional: true,
  },
  industry: {
    type: String,
    optional: true,
  },
  company: {
    type: String,
    optional: true,
  },
  position: {
    type: String,
    optional: true,
  },
  addressAccount: {
    type: String,
    optional: true,
  },
  cityAccount: {
    type: String,
    optional: true,
  },
  stateAccount: {
    type: String,
    optional: true,
  },
  countryAccount: {
    type: String,
    optional: true,
  },
  zipcode: {
    type: String,
    optional: true,
  },
  telephone1: {
    type: String,
    optional: true,
  },
  telephone2: {
    type: String,
    optional: true,
  },
});

/**
 * @name accounts/updateAccount
 * @memberof Mutations/Accounts
 * @summary Updates account fields
 * @param {Object} context - GraphQL execution context
 * @param {Object} input - Necessary input for mutation. See SimpleSchema.
 * @param {String} [input.accountId] - optional decoded ID of account on which entry should be updated, for admin
 * @param {String} [input.currencyCode] - currency code
 * @param {String} [input.firstName] - First name
 * @param {String} [input.language] - Language
 * @param {String} [input.lastName] - Last name
 * @param {String} [input.name] - Name
 * @returns {Promise<Object>} Updated account document
 */
export default async function updateAccount(context, input) {
  inputSchema.validate(input);
  const {
    appEvents,
    collections,
    accountId: accountIdFromContext,
    userId,
  } = context;
  const { Accounts, users } = collections;
  const {
    accountId: providedAccountId,
    bio,
    currencyCode,
    firstName,
    language,
    lastName,
    name,
    note,
    picture,
    username,
    isDeleted,
    languageAccount,
    industry,
    company,
    position,
    addressAccount,
    cityAccount,
    stateAccount,
    countryAccount,
    zipcode,
    telephone1,
    telephone2,
  } = input;

  console.log("in update account providedAccountId ", providedAccountId);
  console.log("accountIdFromContext ", accountIdFromContext);

  const accountId = providedAccountId || accountIdFromContext;
  console.log("Account ID is ", accountId);
  if (!accountId) throw new ReactionError("access-denied", "Access Denied");

  console.log("After account id check ", accountId);

  const account = await Accounts.findOne(
    { _id: accountId },
    { projection: { userId: 1 } }
  );
  if (!account) throw new ReactionError("not-found", "No account found");

  
  if (providedAccountId) {
    console.log("1");
    await context.validatePermissions(`reaction:legacy:accounts`, "create");
  } else {
    console.log("2");
    await context.validatePermissions(
      `reaction:legacy:accounts:${accountId}`,
      "update",
      {
        owner: account.userId,
      }
    );
  }

  const updates = {};
  const updatedFields = [];
  let userUpdate = {};

  console.log("isDeleted", isDeleted, typeof isDeleted)

  if (accountIdFromContext) {
    if (typeof isDeleted === "boolean" || isDeleted === null) {
      updates["isDeleted"]= isDeleted;
      updatedFields.push("isDeleted")
    }
  }

  if (typeof currencyCode === "string" || currencyCode === null) {
    if (currencyCode !== null && !CurrencyDefinitions[currencyCode]) {
      throw new ReactionError(
        "invalid-argument",
        `No currency has code "${currencyCode}"`
      );
    }

    updates["profile.currency"] = currencyCode;
    updatedFields.push("currency");
  }

  if (typeof firstName === "string" || firstName === null) {
    updates["profile.firstName"] = firstName;
    updatedFields.push("firstName");
    userUpdate.firstName = firstName;
  }

  if (typeof lastName === "string" || lastName === null) {
    updates["profile.lastName"] = lastName;
    updatedFields.push("lastName");
    userUpdate.lastName = lastName;
  }

  if (typeof name === "string" || name === null) {
    // For some reason we store name in two places. Should fix eventually.
    updates.name = name;
    updates["profile.name"] = name;
    updatedFields.push("name");
  }

  if (typeof language === "string" || language === null) {
    updates["profile.language"] = language;
    updatedFields.push("language");
  }

  if (typeof bio === "string" || bio === null) {
    updates["profile.bio"] = bio;
    updatedFields.push("bio");
  }

  if (typeof note === "string" || note === null) {
    updates.note = note;
    updatedFields.push("note");
  }

  if (typeof picture === "string" || picture === null) {
    updates["profile.picture"] = picture;
    updatedFields.push("picture");
  }

  if (typeof username === "string" || username === null) {
    // For some reason we store name in two places. Should fix eventually.
    updates.username = username;
    updates["profile.username"] = username;
    userUpdate.username = username;
    updatedFields.push("username");
  }

  if (typeof languageAccount === "string" || languageAccount === null) {
    updates["profile.languageAccount"] = languageAccount;
    updatedFields.push("languageAccount");
  }

  if (typeof industry === "string" || industry === null) {
    updates["profile.industry"] = industry;
    updatedFields.push("industry");
  }

  if (typeof company === "string" || company === null) {
    updates["profile.company"] = company;
    updatedFields.push("company");
  }

  if (typeof position === "string" || position === null) {
    updates["profile.position"] = position;
    updatedFields.push("position");
  }

  if (typeof addressAccount === "string" || addressAccount === null) {
    updates["profile.addressAccount"] = addressAccount;
    updatedFields.push("addressAccount");
  }

  if (typeof cityAccount === "string" || cityAccount === null) {
    updates["profile.cityAccount"] = cityAccount;
    updatedFields.push("cityAccount");
  }

  if (typeof stateAccount === "string" || stateAccount === null) {
    updates["profile.stateAccount"] = stateAccount;
    updatedFields.push("stateAccount");
  }

  if (typeof countryAccount === "string" || countryAccount === null) {
    updates["profile.countryAccount"] = countryAccount;
    updatedFields.push("countryAccount");
  }

  if (typeof zipcode === "string" || zipcode === null) {
    updates["profile.zipcode"] = zipcode;
    updatedFields.push("zipcode");
  }

  if (typeof telephone1 === "string" || telephone1 === null) {
    updates["profile.telephone1"] = telephone1;
    updatedFields.push("telephone1");
  }

  if (typeof telephone2 === "string" || telephone2 === null) {
    updates["profile.telephone2"] = telephone2;
    updatedFields.push("telephone2");
  }

  if (updatedFields.length === 0) {
    throw new ReactionError(
      "invalid-argument",
      "At least one field to update is required"
    );
  }
  const modifier = {
    $set: {
      ...updates,
      updatedAt: new Date(),
    },
  };

  Account.validate(modifier, { modifier: true });
  if (userUpdate) {
    // console.log("userUpdate for user name and password", userUpdate);
    const modifier = {
      $set: {
        ...userUpdate,
        updatedAt: new Date(),
      },
    };
    let userUpdated = await users.findOneAndUpdate(
      {
        _id: accountId,
      },
      modifier,
      {
        returnOriginal: false,
      }
    );
    // console.log("Updated user is ", userUpdated);
  }
  const { value: updatedAccount } = await Accounts.findOneAndUpdate(
    {
      _id: accountId,
    },
    modifier,
    {
      returnOriginal: false,
    }
  );

  await appEvents.emit("afterAccountUpdate", {
    account: updatedAccount,
    updatedBy: userId,
    updatedFields,
  });

  return updatedAccount;
}
