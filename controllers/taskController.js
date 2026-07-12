const taskModel = require("../models/taskModel");

async function getAllTasks(req,res) {

    try{
        const tasks = await taskModel.getAllTasks();

        res.status(200).json(tasks);
    }

    catch (error){
        res.status(500).json({
            message: "Failed to retrieve tasks."
        });
    }

}

async function getTaskById(req, res){
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
        message: "Invalid task ID."
        });
    }

    try{
        const task = await taskModel.getTaskById(id);

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

        console.error(error)
        return res.status(500).json({
            message: "Unexpected failure."
        });

    }
}

async function createTask(req, res) {
    const title = req.body.title;
    const description = req.body.description;

    if (!title || title.trim() === ""){
        return res.status(400).json({
        message: "Task title is missing."
        });
    } //Checks if the task title is missing or not. I used trim() to reject titles containing only spaces.

    try{
        const createdTask = await taskModel.createTask(title, description);
        return res.status(201).json(createdTask);
    }

    catch (error){
        console.log(error);
        
        return res.status(500).json({
            message: "Unexpected failure."
        });
    }
    
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask
};