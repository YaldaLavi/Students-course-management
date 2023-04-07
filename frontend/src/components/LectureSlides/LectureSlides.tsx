/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from 'react'
import PrimarySearchAppBar from "../NavBar/NavBar";
import Footer from '../Footer/Footer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DownloadIcon from '@mui/icons-material/Download';
import './LectureSlides.scss'
import { useSupabaseClient } from '@supabase/auth-helpers-react';
const CDNURL = 'https://lfqvlqwtynlkfeyfuynu.supabase.co/storage/v1/object/public/lectureslides/';

function LectureSlides() {
  const supabase = useSupabaseClient();
  const [slides, setSlides] = useState<any[]>([]);

	useEffect(() => {
    async function getSlides() {
      const {data, error} = await supabase
        .storage
        .from('lectureslides')
        .list('')
  
        if (data !== null) {
          setSlides(data);
        } else {
          console.log(error);
        }
    }
    getSlides();
  }, []);

	slides.sort((a, b) => {
		// Extract week numbers
		const aWeekNum = parseInt(a.name.split("-")[0].replace("Week ", ""));
		const bWeekNum = parseInt(b.name.split("-")[0].replace("Week ", ""));
	
		// Extract day of the week (1 = Monday, 7 = Sunday)
		const aDayNum = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(a.name.split("-")[1]) + 1;
		const bDayNum = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(b.name.split("-")[1]) + 1;
	
		// Compare week numbers first, and then day of the week
		if (aWeekNum === bWeekNum) {
			return aDayNum - bDayNum;
		} else {
			return aWeekNum - bWeekNum;
		}
	});
	console.log(slides);

  return (
    <>
    	<PrimarySearchAppBar />
			<TableContainer component={Paper} className='table'>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell >Week</TableCell>
            <TableCell >Day</TableCell>
            <TableCell >FileName</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
         {slides.map((slide, index) => {
						return (
						<TableRow className='slides-content'>
							{slide.name !== '.emptyFolderPlaceholder' &&
							<>
								<TableCell><h3>{slide.name.split('-')[0]}</h3></TableCell>
								<TableCell><h3>{slide.name.split('-')[1]}</h3></TableCell>
								<TableCell><a href={CDNURL + slide.name} target="_blank" style={{color: 'blue'}}><h3 style={{display: 'flex', alignItems: 'center'}}><DownloadIcon fontSize="small"/>{slide.name.split('-').slice(2).join('-')}</h3></a></TableCell>
							</>
							}
					 	</TableRow>
					 	)
					 })}
        </TableBody>
      </Table>
    </TableContainer>
		<Footer />
    </>
  )
}

export default LectureSlides


