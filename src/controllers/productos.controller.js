const db = require('../config/db');

exports.listar = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM productos WHERE activo = 1');
    res.json(rows);
};

exports.obtenerUno = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(rows[0]);
};

exports.crear = async (req, res) => {
    const { nombre, categoria_id, precio, stock, codigo_barras, sucursal_id } = req.body;
    const [result] = await db.query(
        'INSERT INTO productos (nombre, categoria_id, precio, stock, codigo_barras, sucursal_id) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, categoria_id, precio, stock, codigo_barras, sucursal_id]
    );
    res.json({ id: result.insertId });
};

exports.actualizar = async (req, res) => {
    const { nombre, precio, stock } = req.body;
    await db.query('UPDATE productos SET nombre=?, precio=?, stock=? WHERE id=?', [nombre, precio, stock, req.params.id]);
    res.json({ mensaje: 'Producto actualizado' });
};

exports.eliminar = async (req, res) => {
    await db.query('UPDATE productos SET activo = 0 WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Producto eliminado (baja lógica)' });
};
