const express = require("express");
const { verifyJWT } = require("../auth-guard");
const { findDefinition } = require("../services/formio");

const router = express.Router();


// GET /api/forms/:formKey -> the Form.io definition from the FormIO
// collection (see services/formio.js for how it is found).
router.get("/:formKey", verifyJWT, async (req, res) => {

    try {

        const definition = await findDefinition(req.params.formKey);

        if (!definition) {
            console.warn(`[FORMS][WARN] No FormIO definition with formKey "${req.params.formKey}"`);
            return res.status(404).json({ success: false, message: "This form is not available right now. Please contact the Missions office." });
        }

        return res.json({ success: true, data: definition });

    } catch (error) {

        console.error("[FORMS][ERROR]", error);
        return res.status(500).json({ success: false, message: "Couldn't load the form. Please try again." });

    }

});


module.exports = router;
