import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmployeeService } from '../../Service/Employee'
import toast from 'react-hot-toast'
import { Spinner } from 'reactstrap'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import moment from 'moment'

function Employee() {
  const navigate = useNavigate()
  const [emplyee, setEmplyee] = useState([])
  const [loader, setLoader] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRecord, setTotalRecord] = useState(0)
  const [sort, setSort] = useState('desc')
  const [sortField, setSortField] = useState('created_at')

  const employeeList = () => {
    setLoader(true)
    const data = {
      perPage: 10,
      page: currentPage,
      order_by: sort ? sort : null,
      sort_by: sortField ? sortField : null
    }
    EmployeeService.employeeData(data)
    .then(res => {
      setEmplyee(res?.data?.data?.data)
      setTotalRecord(res?.data?.data?.total)
    }).catch((err) => toast.error(err?.response?.data?.message))
    .finally(() => setLoader(false))
  }

  useEffect(() => {
    employeeList()
  }, [currentPage, sort, sortField])

  const OrdersColumns  = [
    {
      name: 'Id',
      // sortable: true,
      maxwidth:'150px',
      sortField: 'element_id',
      selector: row => row?.employee_id,
      cell: row => {
        return (
          <div onClick={() => navigate(`/employee/edit/${row?.id}`)} className='text-bold' style={{cursor: 'pointer'}}>{row?.employee_id}</div>
        )
      }
    },
    {
      name: 'Name',
      sortField: 'Client',
      minwidth: '150px',
      maxwidth:"300px",
      className: 'line-ellipsis',
      selector: row => row?.name
    },
    {
      name: 'Email',
      minwidth: '200px',
      maxwidth:'500px',
      sortField: 'project',
      className: 'line-ellipsis',
      selector: row => row?.email
    },
    {
      name: 'Gender',
      sortField: 'Client',
      minwidth: '50px',
      maxwidth:"200px",
      className: 'line-ellipsis',
      selector: row => (
          <div style={{textTransform: 'capitalize'}}>{row?.gender}</div>
      )
    },
    {
      name: 'Department',
      sortField: 'Client',
      minwidth: '50px',
      maxwidth:"200px",
      className: 'line-ellipsis',
      selector: row => (
        <div style={{textTransform: 'capitalize'}}>{row?.department}</div>
    )
    },
    {
      name: 'Project',
      maxwidth:'150px',
      minwidth: '180px',
      className: 'line-ellipsis',
      selector: row =>  (
        <div style={{textTransform: 'capitalize'}}>
          {JSON.parse(row?.project)?.map((data, i) => {
            return data + (((JSON.parse(row?.project))?.length - 1 > i) ? ", " : "")
          })}
        </div>
      )
    },
    {
      name: 'Created_at',
      sortField: 'created_at',
      sortable: true,
      maxwidth:'150px',
      minwidth: '180px',
      className: 'line-ellipsis',
      selector: row => moment(row?.created_at).format('DD-MM-YYYY')
    }    
  ]

  const CustomPagination = () => {
    const count = Number(Math.ceil(totalRecord / 10))
    if (totalRecord > 10) {
      return (
        <Fragment>
          <div className="f_flex m-0">
            <b className="me-auto"> {totalRecord?.toLocaleString().trim("")} Results</b>
            <div className="margin">
              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                pageCount={count || 1}
                activeClassName='active'
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                onPageChange={page => setCurrentPage(page.selected + 1)}
                pageClassName={'page-item'}
                nextLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousClassName={'page-item prev'}
                previousLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
              />
            </div>
          </div>
        </Fragment>
      )
    } else {
      return <div className="pb-2"></div>
    }
  }

  const handleSort = (column, sortDirection) => {
    if (column.sortField) {
      setSort(sortDirection)
      setSortField(column.sortField)
    }
  }

  return (
    <div className='main-header navbar-light card header-overlap'>
      <div className='d-flex justify-content-between p-3'>
        <h4 className='d-flex align-items-center mb-0'>Dashboard</h4>
        <button className='btn btn-success' onClick={() => navigate('/employee/create')}>Add Record</button>
      </div>
      <DataTable
        noHeader
        noSubHeader
        sortServer
        pagination
        responsive
        paginationServer
        noDataComponent="There are no data to display"
        columns={OrdersColumns}
        onSort={handleSort}
        className='overflow-hidden overflow-x-scroll'
        paginationComponent={CustomPagination}
        progressPending={loader}
        progressComponent={<Spinner />}
        data={emplyee}
		  />
    </div>
  )
}

export default Employee