"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middlewares/auth");
const user_controller_1 = require("../controllers/user.controller");
const tarjet_controller_1 = require("../controllers/tarjet.controller");
const door_controller_1 = require("../controllers/door.controller");
const personcount_controller_1 = require("../controllers/personcount.controller");
const accessEvent_controller_1 = require("../controllers/accessEvent.controller");
const router = (0, express_1.Router)();
// Login endpoint
router.post('/login', auth_controller_1.login);
// Refresh token endpoint
router.post('/refresh-token', auth_controller_1.refreshToken);
// Create user endpoint
router.post('/users', user_controller_1.createUser);
// Forgot password endpoint
router.post('/forgot-password', user_controller_1.forgotPassword);
// Reset password endpoint
router.post('/reset-password', user_controller_1.resetPassword);
// Logout endpoint
router.post('/logout', auth_1.verifyToken, auth_controller_1.logout);
// Get all users endpoint
router.get('/all-users', auth_1.verifyToken, user_controller_1.getAllUsers);
// Update user endpoint
router.put('/:id/update', auth_1.verifyToken, user_controller_1.updateUser);
// Deshabilitar user endpoint
router.patch('/:id/disable', auth_1.verifyToken, user_controller_1.disableUser);
// Habilitar usuario endpoint
router.patch('/:id/enable', auth_1.verifyToken, auth_1.isAdmin, user_controller_1.enableUser);
// Cambiar Contrasena endpoint 
router.put('/:id/change-password', auth_1.verifyToken, user_controller_1.changePassword);
// Crear tarjeta
router.post('/addCard', auth_1.verifyToken, tarjet_controller_1.createCard);
// Ver todas las tarjetas
router.get('/cards', auth_1.verifyToken, tarjet_controller_1.getAllCards);
// Deshabilitar tarjeta
router.put('/cards/:id/disable', auth_1.verifyToken, tarjet_controller_1.disableCard);
// Habilitar tarjeta
router.put('/cards/:id/enable', auth_1.verifyToken, tarjet_controller_1.enableCard);
// Eliminar tarjeta
router.delete('/cards/:id/delete', auth_1.verifyToken, tarjet_controller_1.deleteCard);
// Bloquear tarjeta permanentemente
router.put('/cards/:id/permanent-block', auth_1.verifyToken, tarjet_controller_1.permanentBlockCard);
// Obtener tarjetas disponibles
router.get('/cards/available', auth_1.verifyToken, tarjet_controller_1.getAvailableCards);
// Asignar tarjeta a usuario
router.put('/cards/:id/assign', auth_1.verifyToken, tarjet_controller_1.assignCard);
// Actualizar tarjeta de usuario
router.patch('/users/:id/card', auth_1.verifyToken, user_controller_1.updateUserCardId);
// Desasignar tarjeta de usuario
router.put('/cards/:id/unassign', auth_1.verifyToken, tarjet_controller_1.unassignCard);
// Liberar tarjeta de usuario
router.patch('/users/:id/release-card', auth_1.verifyToken, tarjet_controller_1.releaseUserCard);
//Conteo de personas
router.get('/personcount/latest', auth_1.verifyToken, personcount_controller_1.getLatestPersonCount);
// Estado más reciente de la puerta
router.get('/door/latest', auth_1.verifyToken, door_controller_1.getLatestDoorState);
// Eventos de acceso recientes
router.get('/access-events/recent', auth_1.verifyToken, accessEvent_controller_1.getRecentAccessEvents);
// Obtener todos los eventos de acceso
router.get('/access-events/all', auth_1.verifyToken, accessEvent_controller_1.getAllAccessEvents);
// Obtener eventos de acceso del usuario autenticado
router.get("/access-events/user", auth_1.verifyToken, accessEvent_controller_1.getUserAccessEvents);
exports.default = router;
