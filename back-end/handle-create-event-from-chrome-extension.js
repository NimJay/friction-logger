/**
 * @param {Request} req
 * @param {Response} res
 */
function handleCreateEventFromChromeExtension(req, res) {
  res.json({}).end();
}

module.exports = { handleCreateEventFromChromeExtension };
