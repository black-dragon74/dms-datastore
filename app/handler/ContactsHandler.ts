import express from "express";
import axios from "axios";
import CONST from "../../utils/Const";
import cheerio from "cheerio";
import { errorToJSON } from "../../utils/Helpers";

interface FacultyContact {
  id: String;
  name: String;
  designation: String;
  phone: String;
  department: String;
  email: String;
  image: String;
}

export default function ContactsHandler(
  req: express.Request,
  res: express.Response
) {
  // Get the Faculty details page form the uni website
  axios
    .get(CONST.CONTACTS_URL)
    .then((response) => {
      // Create a new cheerio object from the response
      const $ = cheerio.load(response.data.toString());

      // Select the
      const respData = $(CONST.CONTACT_FIELD_ID).attr("data-faculty-object");
      if (respData == undefined) {
        console.error("Unable to find the faculty data object");
        res
          .send(500)
          .send(errorToJSON("Unable to find the faculty data object"));
        return;
      }

      // Load the JSON object from this data
      const jsonData = JSON.parse(respData);

      // Loop and create objects
      let jsonResponse = new Array<FacultyContact>();
      let id = 1;

      for (let i = 0; i < jsonData.length; i++) {
        let currData = jsonData[i];

        const name = currData["title"] as String;
        if (name.length == 0) continue;

        let phone = currData["phone"] as String;
        phone = phone
          .trim()
          .split(",")[0]
          .replace("+91", "")
          .replace(" ", "")
          .replace("-", "");

        let currFac: FacultyContact = {
          department: currData["departmentText"],
          designation: currData["designation"],
          email: currData["email"],
          id: id.toString(),
          image: CONST.UNI_BASE_URL + currData["thumbnailImagePath"],
          name: name,
          phone: phone,
        };

        jsonResponse.push(currFac);
        id += 1;
      }

      res.send(jsonResponse);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error.toString());
    });
}
