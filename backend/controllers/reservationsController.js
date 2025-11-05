const { runQuery, getQuery, allQuery } = require('../database');

// GET /reservations - Listar reservas do usuário
const getReservations = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservations = await allQuery(`
      SELECT 
        r.id,
        r.userId,
        r.pickupLocation,
        r.pickupDate,
        r.pickupTime,
        r.returnLocation,
        r.returnDate,
        r.returnTime,
        r.protectionPlanId,
        r.protectionPlanName,
        r.protectionPlanPrice,
        r.paymentMethod,
        r.totalValue,
        r.status,
        r.createdAt,
        c.id as carId,
        c.title as carTitle,
        c.image as carImage,
        c.price as carPrice
      FROM reservations r
      JOIN cars c ON r.carId = c.id
      WHERE r.userId = ?
      ORDER BY r.createdAt DESC
    `, [userId]);

    // Formatar dados para retornar no formato esperado pelo frontend
    const formattedReservations = reservations.map(reservation => ({
      id: `res_${reservation.id}`,
      userId: reservation.userId,
      car: {
        id: reservation.carId,
        title: reservation.carTitle,
        image: reservation.carImage,
        price: reservation.carPrice
      },
      pickupLocation: reservation.pickupLocation,
      pickupDate: reservation.pickupDate,
      pickupTime: reservation.pickupTime,
      returnLocation: reservation.returnLocation,
      returnDate: reservation.returnDate,
      returnTime: reservation.returnTime,
      protectionPlan: {
        id: reservation.protectionPlanId,
        name: reservation.protectionPlanName,
        pricePerDay: reservation.protectionPlanPrice
      },
      paymentMethod: reservation.paymentMethod,
      totalValue: reservation.totalValue,
      status: reservation.status,
      createdAt: reservation.createdAt
    }));

    res.json(formattedReservations);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /reservations/:id - Buscar reserva específica
const getReservationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reservation = await getQuery(`
      SELECT 
        r.id,
        r.userId,
        r.pickupLocation,
        r.pickupDate,
        r.pickupTime,
        r.returnLocation,
        r.returnDate,
        r.returnTime,
        r.protectionPlanId,
        r.protectionPlanName,
        r.protectionPlanPrice,
        r.paymentMethod,
        r.totalValue,
        r.status,
        r.createdAt,
        c.id as carId,
        c.title as carTitle,
        c.image as carImage,
        c.price as carPrice
      FROM reservations r
      JOIN cars c ON r.carId = c.id
      WHERE r.id = ? AND r.userId = ?
    `, [id, userId]);

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    // Formatar dados
    const formattedReservation = {
      id: `res_${reservation.id}`,
      userId: reservation.userId,
      car: {
        id: reservation.carId,
        title: reservation.carTitle,
        image: reservation.carImage,
        price: reservation.carPrice
      },
      pickupLocation: reservation.pickupLocation,
      pickupDate: reservation.pickupDate,
      pickupTime: reservation.pickupTime,
      returnLocation: reservation.returnLocation,
      returnDate: reservation.returnDate,
      returnTime: reservation.returnTime,
      protectionPlan: {
        id: reservation.protectionPlanId,
        name: reservation.protectionPlanName,
        pricePerDay: reservation.protectionPlanPrice
      },
      paymentMethod: reservation.paymentMethod,
      totalValue: reservation.totalValue,
      status: reservation.status,
      createdAt: reservation.createdAt
    };

    res.json(formattedReservation);
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /reservations - Criar nova reserva
const createReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      carId,
      pickupLocation,
      pickupDate,
      pickupTime,
      returnLocation,
      returnDate,
      returnTime,
      protectionPlan,
      paymentMethod,
      totalValue
    } = req.body;

    // Validação dos campos obrigatórios
    if (!carId || !pickupLocation || !pickupDate || !pickupTime || 
        !returnLocation || !returnDate || !returnTime || !protectionPlan || 
        !paymentMethod || !totalValue) {
      return res.status(400).json({ 
        error: 'Todos os campos obrigatórios devem ser preenchidos' 
      });
    }

    // Verificar se o carro existe
    const car = await getQuery('SELECT id FROM cars WHERE id = ?', [carId]);
    if (!car) {
      return res.status(404).json({ error: 'Carro não encontrado' });
    }

    // Criar reserva
    const result = await runQuery(`
      INSERT INTO reservations (
        userId, carId, pickupLocation, pickupDate, pickupTime,
        returnLocation, returnDate, returnTime, protectionPlanId,
        protectionPlanName, protectionPlanPrice, paymentMethod, totalValue
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, carId, pickupLocation, pickupDate, pickupTime,
      returnLocation, returnDate, returnTime, protectionPlan.id,
      protectionPlan.name, protectionPlan.pricePerDay, paymentMethod, totalValue
    ]);

    // Buscar a reserva criada com dados do carro
    const newReservation = await getQuery(`
      SELECT 
        r.id,
        r.userId,
        r.pickupLocation,
        r.pickupDate,
        r.pickupTime,
        r.returnLocation,
        r.returnDate,
        r.returnTime,
        r.protectionPlanId,
        r.protectionPlanName,
        r.protectionPlanPrice,
        r.paymentMethod,
        r.totalValue,
        r.status,
        r.createdAt,
        c.id as carId,
        c.title as carTitle,
        c.image as carImage,
        c.price as carPrice
      FROM reservations r
      JOIN cars c ON r.carId = c.id
      WHERE r.id = ?
    `, [result.id]);

    // Formatar resposta
    const formattedReservation = {
      id: `res_${newReservation.id}`,
      userId: newReservation.userId,
      car: {
        id: newReservation.carId,
        title: newReservation.carTitle,
        image: newReservation.carImage,
        price: newReservation.carPrice
      },
      pickupLocation: newReservation.pickupLocation,
      pickupDate: newReservation.pickupDate,
      pickupTime: newReservation.pickupTime,
      returnLocation: newReservation.returnLocation,
      returnDate: newReservation.returnDate,
      returnTime: newReservation.returnTime,
      protectionPlan: {
        id: newReservation.protectionPlanId,
        name: newReservation.protectionPlanName,
        pricePerDay: newReservation.protectionPlanPrice
      },
      paymentMethod: newReservation.paymentMethod,
      totalValue: newReservation.totalValue,
      status: newReservation.status,
      createdAt: newReservation.createdAt
    };

    res.status(201).json(formattedReservation);
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /reservations/:id - Cancelar reserva
const cancelReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar se a reserva existe e pertence ao usuário
    const reservation = await getQuery(
      'SELECT id FROM reservations WHERE id = ? AND userId = ?',
      [id, userId]
    );

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    // Remover reserva
    await runQuery(
      'DELETE FROM reservations WHERE id = ? AND userId = ?',
      [id, userId]
    );

    res.json({ message: 'Reserva cancelada com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getReservations,
  getReservationById,
  createReservation,
  cancelReservation
};

