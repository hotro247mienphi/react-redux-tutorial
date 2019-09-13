import React from 'react';
import './App.css';
import Helper from './Helper';
import TaskForm from './components/TaskForm';

const log = console.log;
const DATA_KEY = 'DATA_KEY';
const SORT = {
  DESC: 'desc',
  ASC: 'asc',
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      task: null,

      // open form
      formIsOpen: false,

      filter: {
        keyword: '',
        column: 'name',
        direction: SORT.DESC,
      }
    };

    this.evtToggleForm = this.evtToggleForm.bind(this);
    this.evtSubmitTaskForm = this.evtSubmitTaskForm.bind(this);
    this.evtEdit = this.evtEdit.bind(this);
    this.evtDelete = this.evtDelete.bind(this);
  }

  loadTasks() {
    const tasks = localStorage.getItem(DATA_KEY);

    if (tasks) {
      this.setState({ tasks: JSON.parse(tasks) });
    }
  }

  updateTask(tasks, task = null) {
    if (task) {
      this.setState({ tasks });
    } else {
      this.setState({ tasks, task });
    }

    localStorage.setItem(DATA_KEY, JSON.stringify(tasks));
  }

  UNSAFE_componentWillMount() {
    this.loadTasks();
  }

  /** ------------------------------------------------------------- */
  setFormIsOpen(bol) {
    this.setState({
      formIsOpen: bol
    });
  }

  openForm() {
    this.setFormIsOpen(true);
  }

  closeForm() {
    this.setFormIsOpen(false);
  }
  /** ------------------------------------------------------------- */

  evtToggleForm(e) {
    const { formIsOpen } = this.state;
    this.setFormIsOpen(!formIsOpen);
  }

  evtSubmitTaskForm(task) {
    let { tasks } = this.state;

    if (!task.id) {
      tasks.push({
        id: Helper.uid(),
        name: task.name,
        created_at: Helper.now(),
        updated_at: Helper.now(),
      });
      this.updateTask(tasks);
    } else {
      const newTasks = [];
      tasks.forEach(item => {
        if (item.id !== task.id) {
          newTasks.push(item);
          return;
        }
        newTasks.push({
          ...item,
          name: task.name,
          updated_at: Helper.now()
        });

      });
      this.updateTask(newTasks, null);
    }
  }

  evtEdit(task) {
    this.setState({ task });
    this.openForm();
  }

  evtDelete(task) {
    const newTasks = [];
    this.state.tasks.forEach(item => {
      if (item.id !== task.id) {
        newTasks.push(item);
      }
    });
    this.updateTask(newTasks, null);
  }

  evtSetSort(column) {
    const filter = { ...this.state.filter };
    if (column === filter.column) {
      filter.direction = (filter.direction === 'asc' ? 'desc' : 'asc');
    }
    filter.column = column;
    this.setState({ filter });
  }

  evtChangeFitlerKeyword(e) {
    const { filter } = this.state;
    this.setState({
      filter: {
        ...filter,
        keyword: e.target.value
      }
    });

  }

  /** -----------------------------------------------------------------  */

  filterData() {

    const { column, direction, keyword } = this.state.filter;
    const { tasks } = this.state;

    let data = tasks;
    if (keyword.length) {
      data = tasks.filter(function (item) {
        return item.name.includes(keyword);
      });
    }

    // Nếu cột sắp xếp là name
    if (column === 'name') {
      data.sort(function (a, b) {
        switch (direction) {
          case SORT.DESC:
            return a.name > b.name ? -1 : 1;
          case SORT.ASC:
            return a.name < b.name ? -1 : 1;
          default:
            return 0;
        }
      });
    }

    // nếu cột sắp xếp là created_at hoặc updated_at
    if (!!~['created_at', 'updated_at'].indexOf(column)) {
      data.sort(function (a, b) {
        const [ca, cb] = [Helper.strToTime(a[column]), Helper.strToTime(b[column])];

        switch (direction) {
          case SORT.DESC:
            return ca > cb ? -1 : 1;
          case SORT.ASC:
            return ca < cb ? -1 : 1;
          default:
            return 0;
        }
      });
    }

    return data;

  }

  render() {
    const tbody = this.filterData().map((task, index) => {
      return <tr key={task.id} className={this.state.task && this.state.task.id === task.id ? 'bg-high' : ''}>
        <td className="text-center">{index + 1}</td>
        <td>{task.name}</td>
        <td className="text-center">{task.created_at}</td>
        <td className="text-center">{task.updated_at}</td>
        <td className="text-right">
          <button onClick={() => this.evtEdit(task)}>edit</button>
          <button onClick={() => this.evtDelete(task)}>delete</button>
        </td>
      </tr>
    });

    const { task, formIsOpen, filter } = this.state;

    return (
      <div className="App">
        <h2 className="text-center">Tasks manager</h2>

        <TaskForm
          status={formIsOpen}
          task={task}
          handleSubmit={this.evtSubmitTaskForm}>
        </TaskForm>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th className={filter.column === 'name' ? (filter.direction + ' active') : ''}
                onClick={() => this.evtSetSort('name')}>Task </th>

              <th className={filter.column === 'created_at' ? (filter.direction + ' active') : ''}
                onClick={() => this.evtSetSort('created_at')}>Created At</th>

              <th className={filter.column === 'updated_at' ? (filter.direction + ' active') : ''}
                onClick={() => this.evtSetSort('updated_at')}>Updated At</th>

              <th className="text-right">
                <button onClick={this.evtToggleForm}>
                  {this.state.formIsOpen ? 'Close' : 'Open'} Form
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>
                <input type="text" className="full"
                  placeholder="Enter keyword search"
                  value={filter.keyword}
                  onChange={(e) => this.evtChangeFitlerKeyword(e)} />
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {tbody}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
