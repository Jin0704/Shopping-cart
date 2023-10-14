const express = require('express')
const router = express.Router()
const db = require('../../models')
const SettingController = require('../../controllers/admin/setting')
const SettingService = require('../../services/admin/setting')

const settingService = new SettingService(db)
const settingController = new SettingController(settingService)

router.get('/', settingController.getSettings)

module.exports = router