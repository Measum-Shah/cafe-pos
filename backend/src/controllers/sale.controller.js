import * as saleService from "../services/sale.service.js";

// Create sale
export const createSale = async (req, res) => {
  try {
    const sale = await saleService.createSale({
      items: req.body.items,
      discount: req.body.discount,
      paymentMethod: req.body.paymentMethod,
      employee: req.user.id, // 🔒 always from token
    });

    res.status(201).json({
      success: true,
      sale,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all sales
export const getSales = async (req, res) => {
  try {
    const sales = await saleService.getSales(req.query);

    res.status(200).json({
      success: true,
      sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get sale by ID
export const getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);

    res.status(200).json({
      success: true,
      sale,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
