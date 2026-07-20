const taskModel = require("../models/taskModel");

//Helper function to verify the description field of our task object
function verify_description(description){
    if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string") {
            return "Task description must be a string.";
        }
        
    return null;
}

function verify_title(title){
    if (typeof title !== "string" || title.trim() === ""){
        return "Task title must be a non empty string.";
    } // Reject missing titles, non text titles, and titles containing only spaces (using the .trim() method).
    return null;
}
// Gets every task from the database.
async function getAllTasks(req,res) {

    const { done, sort, order = "asc" } = req.query;
    const allowedSortFields = ["id", "title", "created_at"];

    if (done !== undefined && done !== "0" && done !== "1") {
        return res.status(400).json({
            message: "Done must be either 0 or 1."
        });
    }

    if (sort !== undefined && !allowedSortFields.includes(sort)) {
        return res.status(400).json({
            message: "Invalid sort field."
        });
    }

    if (order !== "asc" && order !== "desc") {
        return res.status(400).json({
            message: "Order must be asc or desc."
        });
    }

    try{
        const tasks = await taskModel.getAllTasks(done, sort, order);

        return res.status(200).json(tasks);
    }

    catch (error){
        console.error(error);
        return res.status(500).json({
            message: "Failed to retrieve tasks."
        });
    }

}

// Gets one task using the ID written in the URL.
async function getTaskById(req, res){
    
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
        message: "Invalid task ID."
        });
    }

    try{
        const task = await taskModel.getTaskById(id);
        // db.get() returns undefined when no task is found.
        if (!task){

            return res.status(404).json({
            message: "Task does not exist."
        });

        }

        else{
            return res.status(200).json(task);
        }
    }

    catch(error){

        console.error(error);
        return res.status(500).json({
            message: "Unexpected failure."
        });

    }
}
// Creates a new task using the data sent in the request body.
async function createTask(req, res) {

    const title = req.body.title;
    const description = req.body.description;

    const titleError = verify_title(title);

    if (titleError) {
        return res.status(400).json({
            message: titleError
        });
    }

    // The description is optional, but if it exists it must be text.
    const descriptionError = verify_description(description);
    if (descriptionError) {
        return res.status(400).json({
            message: descriptionError
        });
    }

    try{
        const createdTask = await taskModel.createTask(title.trim(), description);
        return res.status(201).json(createdTask);
    }

    catch (error){
        console.error(error);

        return res.status(500).json({
            message: "Unexpected failure."
        });
    }
    
}

async function updateTask(req,res) {

    const title = req.body.title;
    const description = req.body.description;
    const id = Number(req.params.id);

    const titleError = verify_title(title);

    

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid task ID."
        });
    }

    if (titleError) {
        return res.status(400).json({
            message: titleError
        });
    }

    const descriptionError = verify_description(description);
    if (descriptionError) {
        return res.status(400).json({
            message: descriptionError
        });
    }

    try{
        const updatedTask = await taskModel.updateTask(id,title.trim(),description);
        if (!updatedTask) {
        return res.status(404).json({
            message: "Task does not exist."
        });
    }
        return res.status(200).json(updatedTask);
    }
    catch (error){
        console.error(error);

        return res.status(500).json({
            message: "Unexpected failure!"
        });
    }
}

async function deleteTask(req,res){

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid task ID."
        });
    }

    try{
        const deletedTask = await taskModel.deleteTask(id);

        if (!deletedTask) {
        return res.status(404).json({
            message: "Task does not exist."
        });
    }
        return res.status(200).json(deletedTask);
    }
    catch (error){
        console.error(error);

        return res.status(500).json({
            message: "Unexpected failure!"
        });
    }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
