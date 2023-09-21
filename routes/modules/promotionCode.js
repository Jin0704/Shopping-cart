const express = require('express')
const router = express.Router()
const PromotionCodeController = require('../../controllers/admin/promotionCode')
const PromotionService = require('../../services/admin/promotionCode')
const db  = require('../../models')
// promotioncode 這邊用DI方式寫一次
const promotionService = new PromotionService(db)
const promotionController = new PromotionCodeController(promotionService)
router.get('/', promotionController.findAll)
router.post('/',promotionController.create)
router.get('/:id', promotionController.findOne)
router.put('/:id', promotionController.update)
router.delete('/:id', promotionController.delete)


module.exports = router