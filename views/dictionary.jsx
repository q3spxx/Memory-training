import React from 'react';
import dictionary from '../modules/dictionary.js';
import Table, { TableBody,
                TableCell,
                TableHead,
                TableRow,
                TableFooter,
                TablePagination,
                TableSortLabel} from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Checkbox from 'material-ui/Checkbox';
import Form from './form.jsx';
import enumNames from '../modules/enum.js';
import {connect} from 'react-redux';
import {setChecked,
        changePage,
        changeRowsPerPage,
        setCheckedAll,
        changeSort} from '../actions/dictionaryActions.js';
import {open, close} from '../actions/formActions.js';
import Icon from 'material-ui/Icon';

class Dictionaty extends React.Component {
  constructor () {
    super();
    this.handleOpenForm = this.handleOpenForm.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  handleOpenForm (form) {
    let self = this;
    let formData = {type: form.type, inputs: []};
    let callback;
    let options = [
      enumNames.NOUN,
      enumNames.ADJECTIVE,
      enumNames.VERB,
      enumNames.ADVERB,
      enumNames.PREPOSITION,
      enumNames.PRONOUN,
      enumNames.CONJUNCTION
    ];
    switch (form.type) {
      case "adding":
        formData.title = "Adding new word";
        formData.inputs.push({type: "text", label: "Word", value: "", key: "word"});
        formData.inputs.push({type: "text", label: "Translation", value: "", key: "translation"});
        formData.inputs.push({type: "select", label: "Type", value: "noun", key: "type", options: options});
        callback = () => {
          dictionary.getDictionary();
        };
        formData.submit = (data) => {
          dictionary.add(data, callback);
          self.props.closeForm();
        };
      break;
      case "update":
        let row = this.props.dictionary[this.props.indexCheckedRow].row;
        formData.title = "Update of word"
        formData.inputs.push({type: "text", label: "Word", value: row.word, key: "word"});
        formData.inputs.push({type: "text", label: "Translation", value: row.translation, key: "translation"});
        formData.inputs.push({type: "select", label: "Type", value: row.type, key: "type", options: options});
        callback = () => {
          dictionary.getDictionary();
        };
        formData.submit = (data) => {
          let request = {
            id: row.id,
            data: data
          };
          dictionary.edit(request, callback);
          self.props.closeForm();
      		;
        };
      break;
    };
    this.props.openForm(formData);
  }
  getPage () {
    let page = [];
    let index = this.props.page * this.props.rowsPerPage;
    for (let i = 0; i < this.props.rowsPerPage && index < this.props.dictionary.length; i++) {
      page.push({
        data: this.props.dictionary[index]
      });
      index++;
    };
    return page;
  }
  handleRemove () {
    let ids = [];
    this.props.dictionary.forEach((row) => {
      if (row.checked) ids.push(row.row.id);
    });
    dictionary.remove(ids, () => {
      dictionary.getDictionary();
    });
  }
  getColumnTitles (label) {
    return (
      <TableRow className="dictionary-row dictionary-title-row">
        <TableCell padding="checkbox">
          <Checkbox onClick={this.props.setCheckedAll} checked={this.props.checkedAll} />
        </TableCell>
        {
          this.props.titles.map((title, i) => {
            return (
              <TableCell
                key={i}
                numeric={title.numeric}
                padding={title.numeric ? "default" : "none"}
                className="dictionary-title"
                >
                <Tooltip
                  title="Sort"
                  enterDelay={300}
                  >
                  <TableSortLabel
                    active={title.active}
                    direction={title.direction}
                    onClick={event => this.props.changeSort(i)}
                    >
                    {title.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          })
        }
      </TableRow>
    );
  }
  render () {
    let page = this.getPage();
    return (
      <div className="dictionary">
        <Toolbar style={{minHeight: "0px", padding: "0px"}} className="dictionary-toolbar">
          <Button onClick={event => this.handleOpenForm({type: "adding"})}>add</Button>
          <Button onClick={this.handleRemove}>remove</Button>
          {this.props.updateButton ? <Button onClick={event => this.handleOpenForm({type: "update"})}>update</Button>: ""}
          {this.props.loading ? <CircularProgress  thickness={7} /> : ""}
        </Toolbar>
        <Table>
          <TableHead>
            {this.getColumnTitles()}
          </TableHead>
          <TableBody>
            {
              page.map((row, i) => {
                return (
                  <TableRow
                    hover
                    key={i}
                    className="dictionary-row"
                     >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={row.data.checked}
                        onClick={event => this.props.setChecked(this.props.page * this.props.rowsPerPage + i)}
                        />
                    </TableCell>
                    <TableCell className="dictionary-cell" padding="none">{row.data.row.word}</TableCell>
                    <TableCell className="dictionary-cell" padding="none">{row.data.row.translation}</TableCell>
                    <TableCell className="dictionary-cell" padding="none">{row.data.row.type}</TableCell>
                    <TableCell className="dictionary-cell" numeric>{row.data.row.rating}</TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={this.props.dictionary.length}
                rowsPerPage={this.props.rowsPerPage}
                page={this.props.page}
                onChangePage={this.props.changePage}
                onChangeRowsPerPage={this.props.changeRowsPerPage}
                 />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    dictionary: state.dictionary.view,
    loading:state.dictionary.loading,
    page: state.dictionary.page,
    rowsPerPage: state.dictionary.rowsPerPage,
    checkedAll: state.dictionary.checkedAll,
    titles: state.dictionary.titles,
    updateButton: state.dictionary.updateButton,
    indexCheckedRow: state.dictionary.indexCheckedRow
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setChecked: index => dispatch(setChecked(index)),
    changePage: (event, page) => dispatch(changePage(page)),
    changeRowsPerPage: event => dispatch(changeRowsPerPage(event.target.value)),
    setCheckedAll: () => dispatch(setCheckedAll()),
    changeSort: index => dispatch(changeSort(index)),
    openForm: data => dispatch(open(data)),
    closeForm: () => dispatch(close())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dictionaty);
