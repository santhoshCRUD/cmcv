const express = require("express");
const mongoose = require("mongoose");
const { verifyJWT } = require("../auth-guard");

const router = express.Router();

const MmsApplication = mongoose.model(
    "MmsApplication",
    new mongoose.Schema(
        {},
        {
            collection: "MmsApplication",
            strict: false
        }
    )
);


router.get(
    "/mmsapplication/:empNumber",
    verifyJWT,
    async (req, res) => {

        try {

            // =================================================
            // Employee number from endpoint
            // Example:
            // /api/MmsApplication/55896
            // =================================================

            const MmsId =
                req.params.empNumber?.trim();


            console.log(
                `[MmsApplication][INFO] Fetching applications for employee: ${MmsId}`
            );


            // =================================================
            // Validate employee number
            // =================================================

            if (!MmsId) {

                console.log(
                    "[MmsApplication][ERROR] Employee number not provided"
                );

                return res.status(400).json({

                    success: false,

                    message: "Employee number is required"

                });

            }


            // =================================================
            // Fetch ALL applications for employee
            // =================================================
            // 1. Database Query: Use .select() to fetch only required fields from MongoDB
            const mmsApplications = await MmsApplication.find({
                $or: [
                    { empNumber: MmsId },
                    { empNumber: Number(MmsId) }
                ]
            })
                .select(
                    "name department empNumber designation phoneNumber email missionHospital fromDate toDate saveDraft status visitStatus completionCertificate uploadPicture verifiedBy submit added isDeleted modified visitedThisHospitalInTheLastSixMonths"
                )
                .sort({ "added.addedDate": -1 })
                .lean();

            if (!mmsApplications.length) {
                return res.status(404).json({
                    success: false,
                    message: "No applications found"
                });
            }

            // 2. Map Payload: Clean top-level fields and strip nested array metadata
            const data = mmsApplications.map((mmsApplication) => ({
                name: mmsApplication.name ?? null,
                department: mmsApplication.department ?? null,
                empNumber: mmsApplication.empNumber ?? null,
                designation: mmsApplication.designation ?? null,
                phoneNumber: mmsApplication.phoneNumber ?? null,
                email: mmsApplication.email ?? null,

                missionHospitalId: mmsApplication.missionHospital?._id ?? null,
                missionHospitalName: mmsApplication.missionHospital?.missionHospitalName ?? null,

                fromDate: mmsApplication.fromDate ?? null,
                toDate: mmsApplication.toDate ?? null,

                saveDraft: mmsApplication.saveDraft ?? false,
                status: mmsApplication.status ?? null,
                visitStatus: mmsApplication.visitStatus ?? null,

                // // Clean completionCertificate objects to include only 'name' and 'url'
                // completionCertificate: Array.isArray(mmsApplication.completionCertificate)
                //     ? mmsApplication.completionCertificate.map((file) => ({
                //         name: file.name ?? null,
                //         url: file.url ?? null
                //     }))
                //     : [],

                // // Clean uploadPicture objects to include only 'name' and 'url'
                // uploadPicture: Array.isArray(mmsApplication.uploadPicture)
                //     ? mmsApplication.uploadPicture.map((file) => ({
                //         name: file.name ?? null,
                //         url: file.url ?? null
                //     }))
                //     : [],

                // verifiedBy: mmsApplication.verifiedBy ?? null,
                // submit: mmsApplication.submit ?? false,

                // addedById: mmsApplication.added?.userId ?? null,
                // addedByName: mmsApplication.added?.userName ?? null,
                // addedByDate: mmsApplication.added?.addedDate ?? null,

                // isDeleted: mmsApplication.isDeleted ?? false,

                // modifiedById: mmsApplication.modified?.userId ?? null,
                // modifiedByName: mmsApplication.modified?.userName ?? null,
                // modifiedDate: mmsApplication.modified?.modifiedDate ?? null,

                // visitedThisHospitalInTheLastSixMonths:
                //     mmsApplication.visitedThisHospitalInTheLastSixMonths ?? "no"
            }));

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error) {

            console.error(
                "[MmsApplication][ERROR] Failed to fetch Mms Applications:",
                error
            );

            return res.status(500).json({

                success: false,

                message: "Invalid request"

            });

        }

    }
);


module.exports = router;