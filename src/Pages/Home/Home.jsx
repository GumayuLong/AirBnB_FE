import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Card } from "antd";
import { departmentService } from '../../services/departmentService';
const { Meta } = Card;

export default function Home() {
    const navigate = useNavigate();
    const [listRoom, setListRoom] = useState([]);
    useEffect(() => {
        fetchRoomList();
    }, [])

    const fetchRoomList = async() => {
        await departmentService.fetchDepartmentApi()
			.then((result) => {
                setListRoom(result.data);
			})
			.catch((err) => {
				console.log(err);
			});
    }

    const renderRoomList = () => {
        return listRoom.map((element) => {
            return (
				<div
					key={element.id}
					className="col-12 col-sm-12 col-md-6 col-xl-4 mt-5"
				>
					<Card
						onClick={() => {
							navigate(`/detail/${element.id}`);
						}}
						hoverable
						cover={
							<img
								alt="example"
								src={element.hinh_anh}
								width={250}
								height={150}
								style={{
									objectFit: "cover",
									objectPosition: "bottom",
								}}
							/>
						}
					>
						<Meta
							title={element.ten_phong}
							description={`Member: ${element.khach}
                Price: ${element.gia_tien}$
                `}
						/>
					</Card>
				</div>
			);
        })
    }

  return (
		<div className="py-5 container">
			<div className="row mx-auto">{renderRoomList()}</div>
		</div>
  );
}
