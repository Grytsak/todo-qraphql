const Task = require('../models/Task')

const { 
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLList
} = require('graphql')

// Task Type
const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        completed: { type: GraphQLBoolean }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent, args) {
                return Task.find()
            }
        },
        task: {
            type: TaskType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Task.findById(args.id)
            }
        }
    }
})

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTask: {
            type: TaskType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const task = new Task({
                    name: args.name
                })

                return task.save()
            }
        },
        editTaskName: {
            type: TaskType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLNonNull(GraphQLString) }
            }, 
            resolve(parent, args) {
                return Task.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name
                        }
                    },
                    { new: true }
                )
            }
        },
        toggleTaskStatus: {
            type: TaskType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                completed: { type: GraphQLNonNull(GraphQLBoolean) }
            }, 
            resolve(parent, args) {
                return Task.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            completed: args.completed
                        }
                    },
                    { new: true }
                )
            }
        },
        deleteTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const task = Task.findById(args.id)
                task.remove()
                return task
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})