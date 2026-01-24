import * as saleService from "../services/sale.service.js";

// Create a new sale/order
export const createSale = async (req, res) => {
  try {
    const employee = req.user.id; // set by authMiddleware
    const { products, paymentMethod } = req.body;

    const sale = await saleService.createSale({ products, employee, paymentMethod });
    res.status(201).json({ message: "Sale created successfully", sale });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all sales (optional date filter)
export const getSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sales = await saleService.getSales(startDate, endDate);
    res.status(200).json({ sales });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get sale by ID
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await saleService.getSaleById(id);
    res.status(200).json({ sale });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
