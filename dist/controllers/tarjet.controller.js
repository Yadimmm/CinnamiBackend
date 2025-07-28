"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permanentBlockCard = exports.releaseUserCard = exports.unassignCard = exports.assignCard = exports.deleteCard = exports.enableCard = exports.disableCard = exports.updateCardUID = exports.getCardById = exports.getAvailableCards = exports.getAllCards = exports.createCard = void 0;
const Card_1 = require("../models/Card");
const mongoose_1 = require("mongoose");
const User_1 = require("../models/User");
// Crear nueva tarjeta solo UID
const createCard = async (req, res) => {
    try {
        const { uid } = req.body;
        // Validar que se envió el UID y es string no vacío
        if (typeof uid !== 'string' || !uid.trim()) {
            return res.status(400).json({
                message: 'El UID de la tarjeta es requerido y debe ser un string'
            });
        }
        // Verificar que no exista una tarjeta con ese UID
        const existingCard = await Card_1.Card.findOne({ uid: uid.toUpperCase() });
        if (existingCard) {
            return res.status(409).json({
                message: 'Ya existe una tarjeta con ese UID'
            });
        }
        // Crea nueva tarjeta
        const newCard = new Card_1.Card({
            uid: uid.toUpperCase(),
            state: true,
            issueDate: new Date(),
            disabledAt: undefined,
            assignedTo: undefined
        });
        // Guarda la tarjeta en la base de datos
        const savedCard = await newCard.save();
        return res.status(201).json({
            message: 'Tarjeta creada exitosamente',
            card: savedCard
        });
    }
    catch (error) {
        console.error('Error ocurrido en createCard:', error);
        return res.status(500).json({
            message: 'Error al crear tarjeta',
            error
        });
    }
};
exports.createCard = createCard;
// Obtener todas las tarjetas
const getAllCards = async (req, res) => {
    try {
        const cards = await Card_1.Card.find()
            .populate('assignedTo', 'username email firstName lastName')
            .sort({ createdAt: -1 });
        res.status(200).json({
            message: 'Tarjetas obtenidas exitosamente',
            cards
        });
    }
    catch (error) {
        console.error('Error ocurrido en getAllCards:', error);
        res.status(500).json({ message: 'Error al obtener las tarjetas' });
    }
};
exports.getAllCards = getAllCards;
// Obtener tarjetas disponibles para asignar
const getAvailableCards = async (req, res) => {
    try {
        const availableCards = await Card_1.Card.find({
            state: true,
            assignedTo: null
        }).sort({ createdAt: -1 });
        res.status(200).json({
            message: 'Tarjetas disponibles obtenidas exitosamente',
            cards: availableCards,
            total: availableCards.length
        });
    }
    catch (error) {
        console.error('Error ocurrido en getAvailableCards:', error);
        res.status(500).json({ message: 'Error al obtener tarjetas disponibles' });
    }
};
exports.getAvailableCards = getAvailableCards;
// Obtener tarjeta específica
const getCardById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'ID de tarjeta inválido'
            });
        }
        const card = await Card_1.Card.findById(id)
            .populate('assignedTo', 'username email firstName lastName');
        if (!card) {
            return res.status(404).json({
                message: 'Tarjeta no encontrada'
            });
        }
        res.status(200).json({
            message: 'Tarjeta obtenida exitosamente',
            card
        });
    }
    catch (error) {
        console.error('Error ocurrido en getCardById:', error);
        res.status(500).json({ message: 'Error al obtener la tarjeta' });
    }
};
exports.getCardById = getCardById;
// Edita UID de tarjeta
const updateCardUID = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'ID de tarjeta inválido'
            });
        }
        // Validar que uid es string no vacío
        if (typeof uid !== 'string' || !uid.trim()) {
            return res.status(400).json({
                message: 'El nuevo UID es requerido y debe ser un string'
            });
        }
        // Verifica que no exista otra tarjeta con ese UID
        const existingCard = await Card_1.Card.findOne({
            uid: uid.toUpperCase(),
            _id: { $ne: id }
        });
        if (existingCard) {
            return res.status(409).json({
                message: 'Ya existe otra tarjeta con ese UID'
            });
        }
        // Actualiza la tarjeta
        const updatedCard = await Card_1.Card.findByIdAndUpdate(id, { uid: uid.toUpperCase() }, { new: true, runValidators: true }).populate('assignedTo', 'username email firstName lastName');
        if (!updatedCard) {
            return res.status(404).json({
                message: 'Tarjeta no encontrada'
            });
        }
        res.status(200).json({
            message: 'UID de tarjeta actualizado exitosamente',
            card: updatedCard
        });
    }
    catch (error) {
        console.error('Error ocurrido en updateCardUID:', error);
        res.status(500).json({ message: 'Error al actualizar UID de tarjeta', error });
    }
};
exports.updateCardUID = updateCardUID;
// Deshabilita la tarjeta
const disableCard = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'ID de tarjeta inválido'
            });
        }
        const card = await Card_1.Card.findById(id);
        if (!card) {
            return res.status(404).json({
                message: 'Tarjeta no encontrada'
            });
        }
        // Cambia el estado 
        card.state = false;
        card.disabledAt = new Date();
        const updatedCard = await card.save();
        res.status(200).json({
            message: 'Tarjeta deshabilitada exitosamente',
            card: updatedCard
        });
    }
    catch (error) {
        console.error('Error ocurrido en disableCard:', error);
        res.status(500).json({ message: 'Error al deshabilitar tarjeta', error });
    }
};
exports.disableCard = disableCard;
// Rehabilita la tarjeta
const enableCard = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'ID de tarjeta inválido'
            });
        }
        const card = await Card_1.Card.findById(id);
        if (!card) {
            return res.status(404).json({
                message: 'Tarjeta no encontrada'
            });
        }
        // Cambia el estado a activa
        card.state = true;
        card.disabledAt = undefined;
        const updatedCard = await card.save();
        res.status(200).json({
            message: 'Tarjeta rehabilitada exitosamente',
            card: updatedCard
        });
    }
    catch (error) {
        console.error('Error ocurrido en enableCard:', error);
        res.status(500).json({ message: 'Error al rehabilitar tarjeta', error });
    }
};
exports.enableCard = enableCard;
// Elimina tarjeta
const deleteCard = async (req, resp) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return resp.status(400).json({
                message: 'ID de tarjeta inválido'
            });
        }
        const card = await Card_1.Card.findByIdAndDelete(id);
        if (!card) {
            return resp.status(404).json({
                message: 'Tarjeta no encontrada'
            });
        }
        resp.status(200).json({
            message: 'Tarjeta eliminada exitosamente',
            card
        });
    }
    catch (error) {
        console.error('Error ocurrido en deleteCard:', error);
        resp.status(500).json({ message: 'Error al eliminar tarjeta', error });
    }
};
exports.deleteCard = deleteCard;
// Asigna tarjeta a un usuario
const assignCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'ID de tarjeta inválido'
            });
        }
        const card = await Card_1.Card.findById(id);
        if (!card) {
            return res.status(404).json({
                message: 'Tarjeta no encontrada'
            });
        }
        // Permite desasignar si userId no viene o es null
        if (!userId) {
            card.assignedTo = null;
            card.state = true;
            await card.save();
            return res.status(200).json({
                message: 'Tarjeta desasignada exitosamente',
                card
            });
        }
        if (typeof userId !== 'string' || !mongoose_1.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'ID de usuario inválido'
            });
        }
        // Asigna la tarjeta
        card.assignedTo = new mongoose_1.Types.ObjectId(userId);
        card.state = true;
        const updatedCard = await card.save();
        res.status(200).json({
            message: 'Tarjeta asignada exitosamente',
            card: updatedCard
        });
    }
    catch (error) {
        console.error('Error ocurrido en assignCard:', error);
        res.status(500).json({ message: 'Error al asignar/desasignar tarjeta', error });
    }
};
exports.assignCard = assignCard;
// Desasigna tarjeta 
const unassignCard = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'ID de tarjeta inválido'
            });
        }
        const card = await Card_1.Card.findById(id);
        if (!card) {
            return res.status(404).json({
                message: 'Tarjeta no encontrada'
            });
        }
        card.assignedTo = null;
        const updatedCard = await card.save();
        res.status(200).json({
            message: 'Tarjeta desasignada exitosamente',
            card: updatedCard
        });
    }
    catch (error) {
        console.error('Error ocurrido en unassignCard:', error);
        res.status(500).json({ message: 'Error al desasignar tarjeta', error });
    }
};
exports.unassignCard = unassignCard;
// Desasigna la tarjeta desde el usuario
const releaseUserCard = async (req, res) => {
    try {
        const userId = req.params.id;
        if (typeof userId !== 'string' || !mongoose_1.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID de usuario inválido' });
        }
        const user = await User_1.User.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        if (user.cardId) {
            // Libera la tarjeta en la colección de tarjetas
            const card = await Card_1.Card.findOne({ uid: user.cardId });
            if (card) {
                card.assignedTo = null;
                await card.save();
            }
            // Libera la tarjeta en el usuario
            await User_1.User.updateOne({ _id: userId }, { $set: { cardId: null } });
        }
        res.status(200).json({ message: 'Tarjeta liberada correctamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al liberar tarjeta', error });
    }
};
exports.releaseUserCard = releaseUserCard;
// Bloqueo permanente de tarjeta
const permanentBlockCard = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'ID de tarjeta inválido'
            });
        }
        const card = await Card_1.Card.findById(id);
        if (!card) {
            return res.status(404).json({
                message: 'Tarjeta no encontrada'
            });
        }
        card.permanentBlocked = true;
        card.state = false;
        card.disabledAt = new Date();
        await card.save();
        res.status(200).json({
            message: 'Tarjeta bloqueada permanentemente',
            card
        });
    }
    catch (error) {
        console.error('Error en permanentBlockCard:', error);
        res.status(500).json({ message: 'Error al bloquear permanentemente la tarjeta', error });
    }
};
exports.permanentBlockCard = permanentBlockCard;
