package com.sktelecom.vehicle.exception;

public class VehicleException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	private int errorCode;
	private String errorMessage;


	public VehicleException() {
	}

	public VehicleException(int errorCode, Exception exeception) {
		this(errorCode, null, exeception);
	}

	public VehicleException(int errorCode, String errorMessage, Exception exeception) {
		super(errorMessage, exeception);
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}

	public VehicleException(String s) {
		super(s);
	}
	
	public VehicleException(String s, Exception exeception) {
		super(s, exeception);
	}

	public int getErrorCode() {
		return this.errorCode;
	}

	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return this.errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

}
