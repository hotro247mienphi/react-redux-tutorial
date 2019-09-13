import React from 'react';

const log = console.log;

class TaskForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            task: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.hanlerNameChange = this.hanlerNameChange.bind(this);
    }

    setTask(task) {

        if (task) {
            this.setState({ task: { ...task } });
        } else {
            this.setState({
                task: {
                    id: null,
                    name: '',
                }
            });
        }
    }

    UNSAFE_componentWillMount() {
        this.setTask(this.props.task);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setTask(props.task);
    }

    handleSubmit() {
        const task = this.state.task;
        this.props.handleSubmit(task);
    }

    hanlerNameChange(e) {
        const task = {
            name: e.target.value
        };

        this.setState({
            task: { ...this.state.task, ...task }
        });
    }

    render() {
        const { task } = this.state;
        if (this.props.status) {
            return (
                <div className="text-center search-form">
                    <input type="text"
                    value={task.name} 
                    onChange={this.hanlerNameChange} 
                    placeholder="Enter task name"/>
                    <button onClick={this.handleSubmit}>
                        {task.id ? 'Save change' : 'Create new'}
                    </button>
                </div>
            );
        }

        return '';
    }
}

export default TaskForm;