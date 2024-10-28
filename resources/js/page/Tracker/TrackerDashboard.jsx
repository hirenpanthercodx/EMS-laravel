import React, { Fragment, useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import toast from 'react-hot-toast'
import { TrackerService } from '../../Service/Tracker'
import Flatpickr from 'react-flatpickr'
import "flatpickr/dist/themes/material_green.css";
import { Spinner } from 'reactstrap'
import ReactPaginate from 'react-paginate'
import { FilterDetails } from '../../routes'
import moment from 'moment'

function TrackerDashboard() {
    const [trackerDate, setTrackerDate] = useState(moment().format('YYYY-MM-DD'))
    const [trackerData, setTrackerData] = useState([])
    const [totalRecord, setTotalRecord] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loader, setLoader] = useState(false)
    const [filterValue, setFilterValue] = useContext(FilterDetails)

    const timeConverter = (time) => {
        return `${('0' + Math.floor((time / 3600000) % 60)).slice(-2)}:${(
          '0' + Math.floor((time / 60000) % 60)
        ).slice(-2)}:${('0' + Math.floor((time / 1000) % 60)).slice(-2)}`;
    };

    const trackerColumns  = [
        {
            name: 'Duration',
            className: 'line-ellipsis',
            selector: row => timeConverter(row?.time)
        },
        {
            name: 'Start',
            className: 'line-ellipsis',
            selector: row => row?.dateStart ? moment(row?.dateStart).format('hh:mm A') : ''
        },
        {
            name: 'End',
            sortField: 'project',
            className: 'line-ellipsis',
            selector: row => row?.dateEnd ? moment(row?.dateEnd).format('hh:mm A') : ''
        },
        {
            name: 'Mouse Click',
            sortField: 'note',
            className: 'line-ellipsis',
            selector: row => row?.mouseClick
        },
        {
            name: 'KeyBoard Click',
            sortField: 'note',
            className: 'line-ellipsis',
            selector: row => row?.keyBoardClick
        },
        {
            name: 'Note',
            sortField: 'note',
            className: 'line-ellipsis',
            selector: row => row?.description
        }
    ]

    useEffect(() => {
        setLoader(true)
        const date = {
            date: moment(trackerDate).format('YYYY-MM-DD'),
            perPage: 10,
            page: currentPage
        }
        TrackerService.getTrackerByDate(date)
        .then((res) => {
            setTrackerData(res?.data?.data)
            setTotalRecord(res?.data?.total)
            setFilterValue({...filterValue, tracker_stop: false})
        })
        .catch((err) => toast.error(err?.response?.data?.message))
        .finally(() => setLoader(false))
    }, [trackerDate, currentPage, filterValue?.tracker_stop])
  
    const CustomPagination = () => {
        const count = Number(Math.ceil(totalRecord / 10))

        if (totalRecord > 10) {
            return (
                <Fragment>
                    <div className="f_flex">
                        <b className="me-auto"> {totalRecord?.toLocaleString().trim("")} Results</b>
                        <div className='m_client'>
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
        } else return <div className='pt-2'></div>
    }

  return (
    <div className='main-header navbar-light card header-overlap'>
        <div className='d-flex justify-content-end p-3'>
            <Flatpickr 
                className='col-3' 
                onChange={(data) => { setCurrentPage(1); setTrackerDate(data[0]) }}
                placeholder='Select Date'
                value={trackerDate}
                options={{ 
                    enableTime: false, 
                    altInput: true, 
                    dateFormat: 'Y-m-d H:i',
                    disableMobile : true
                }}
            />
        </div>
        <DataTable
            noHeader
            noSubHeader
            sortServer
            pagination
            responsive
            paginationServer
            noDataComponent="There are no data to display"
            columns={trackerColumns}
            className='overflow-hidden overflow-x-scroll'
            paginationComponent={CustomPagination}
            progressPending={loader}
            progressComponent={<Spinner />}
            data={trackerData}
        />
    </div>
  )
}

export default TrackerDashboard