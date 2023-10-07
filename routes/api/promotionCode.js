const express = require('express')
const router = express.Router()
const PromotionCodeApiController = require("../../controllers/api/promotionCode")
const PromotionService = require('../../services/admin/promotionCode')
const db = require('../../models')

const promotionService = new PromotionService(db)
const promotionCodeApiController = new PromotionCodeApiController(promotionService)

router.get('/', promotionCodeApiController.findAll)
router.post('/',promotionCodeApiController.create)
router.get('/:id', promotionCodeApiController.findOne)
router.put('/:id', promotionCodeApiController.update)
router.delete('/:id', promotionCodeApiController.delete)

module.exports = router