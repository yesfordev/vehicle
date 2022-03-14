package com.sktelecom.vehicle.vo;

import java.io.Serializable;

public class LoginVo implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private String empid;	
	private String car4num;	//자동차뒷번호(4자리)
	private String username;
	private String deptname;
	private String position;
	private String carname;
	private String carnumber;
	private String status;
	
	public String getEmpid() {
		return empid;
	}
	public void setEmpid(String empid) {
		this.empid = empid;
	}
	public String getCar4num() {
		return car4num;
	}
	public void setCar4num(String car4num) {
		this.car4num = car4num;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getDeptname() {
		return deptname;
	}
	public void setDeptname(String deptname) {
		this.deptname = deptname;
	}
	public String getPosition() {
		return position;
	}
	public void setPosition(String position) {
		this.position = position;
	}
	public String getCarname() {
		return carname;
	}
	public void setCarname(String carname) {
		this.carname = carname;
	}
	public String getCarnumber() {
		return carnumber;
	}
	public void setCarnumber(String carnumber) {
		this.carnumber = carnumber;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	@Override
	public String toString() {
		return "LoginVo [empid=" + empid + ", car4num=" + car4num + ", username=" + username + ", deptname=" + deptname
				+ ", position=" + position + ", carname=" + carname + ", carnumber=" + carnumber + ", status=" + status
				+ "]";
	}	
	
	
	
}
