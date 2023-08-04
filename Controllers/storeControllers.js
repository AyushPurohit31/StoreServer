const UserModel = require('../Models/User');
const nodemailer = require("nodemailer");

const getItems = async (req, res) => {
    const {userId} = req.params;
  try {
    // Fetch the user from the database
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the storeItemDetails from the user
    const storeItems = user.storeItemDetails;

    res.json({ storeItems }); // Sending the store items data in the response
  } catch (error) {
    console.error('Error fetching store items:', error);
    res.status(500).json({ message: 'Server error' });
  }
  };

  const getBills = async(req,res)=>{
    const {userId} = req.params;
    try {
      // Fetch the user from the database
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Get the storeItemDetails from the user
      const bills = user.bills;
      res.json({ bills }); // Sending the store items data in the response
    } catch (error) {
      console.error('Error fetching bills:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const editItem = async (req, res) => {
    const userId = req.params.userId;
    const { name, price, quantity, itemId } = req.body;
  
    try {
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const storeItem = user.storeItemDetails.find(item => item._id.toString() === itemId);
  
      if (!storeItem) {
        return res.status(404).json({ error: 'Store item not found' });
      }
  
      storeItem.name = name;
      storeItem.price = price;
      storeItem.quantity = quantity;

      await user.save();
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  };

  const deleteItem = async (req, res) => {
    const userId = req.params.userId;
    const { itemId } = req.body;

    try {
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const itemIndex = user.storeItemDetails.findIndex(item => item._id.toString() === itemId);

      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Store item not found' });
      }

      user.storeItemDetails.splice(itemIndex, 1);

      await user.save();
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  };

  const updateStatus = async(req,res)=>{
    try {
      const { userId, billId } = req.body;
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const billIndex = user.bills.findIndex((bill) => bill._id.toString() === billId);
  
      if (billIndex === -1) {
        return res.status(404).json({ error: 'Bill not found' });
      }

      user.bills[billIndex].status = 'paid';
      
      await user.save();
  
      return res.json({ message: 'Bill status updated successfully' });
    } catch (err) {
      console.error('Error updating bill status:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  const sendEmail = async(user, items, billToAdd)=>{

    let tableRows = '';

    items.forEach((item) => {
      tableRows += `
        <tr>
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td>${item.quantity}</td>
        </tr>
      `;
    });

    const htmlContent = `
      <h3>Thanks for shopping. Here is your bill of total amout = ${billToAdd.amount} Rs. </h3>
      <table border="1">
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
        </tr>
        ${tableRows}
      </table>
    `;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
  });
  
    const mailOptions = {
      from: user.email,
      to: billToAdd.email,
      subject: `Bill from ${user.name} via StoreMate`,
      html: htmlContent
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  

  const addBill = async(req, res) =>{
    const userId = req.body.userId; 
    const billToAdd = req.body.bill;
    const items = req.body.items;

    try {
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      for (const item of items) {
        const { name, quantity } = item;
        const storeItem = user.storeItemDetails.find((item) => item.name === name);
  
        if (storeItem) {
          storeItem.quantity -= quantity;
          if(storeItem.quantity<0){
            storeItem.quantity = 0;
          }
        } else {
          console.log(`Item "${name}" not found in database.`);
        }
      }
    
      user.bills.push(billToAdd);
  
      await user.save();
      
      sendEmail(user, items, billToAdd);
  
      res.json({ message: 'bill added successfully' });
    } catch (error) {
      console.error('Error adding bill:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

async function addItems(req, res) {
  const userId = req.body.userId; 
  const itemsToAdd = req.body.items;

  try {
    // Fetch the user from the database
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the items to the storeItemDetails
    itemsToAdd.forEach((item) => {
      user.storeItemDetails.push(item);
    });


    // Save the updated user document
    await user.save();

    res.json({ message: 'Items added successfully' });
  } catch (error) {
    console.error('Error adding store items:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
    getItems ,addItems, editItem, deleteItem, addBill, getBills, updateStatus
};