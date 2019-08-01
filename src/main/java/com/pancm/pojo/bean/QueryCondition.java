package com.pancm.pojo.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name = "QueryCondition")
@XmlType(propOrder = {"start", "rows", "totalRow", "totalPage", "direction"})
@JsonInclude(Include.NON_EMPTY)
@JsonPropertyOrder({"start", "rows", "totalRow", "totalPage", "direction"})
public class QueryCondition {

	private long start = 1;
	private int rows = 10;
	private Long totalRow;
	private Long totalPage;
	private int direction = SortDirection.DESC.getValue();	

	public QueryCondition(){

	}

	public QueryCondition(long start){
		this.start = start;
	}

	public QueryCondition(long start, int rows){
		this(start);
		this.rows = rows;
	}

	public @XmlElement long getStart() {
		return start;
	}
	public void setStart(long start) {
		this.start = start;
	}
	public @XmlElement int getRows() {
		return rows;
	}
	public void setRows(int rows) {
		this.rows = rows;
	}
	public @XmlElement Long getTotalRow() {
		return totalRow;
	}
	public void setTotalRow(Long totalRow) {
		this.totalRow = totalRow;
	}
	public @XmlElement Long getTotalPage() {
		return totalPage;
	}
	public void setTotalPage(Long totalPage) {
		this.totalPage = totalPage;
	}
	public @XmlElement int getDirection() {
		return direction;
	}
	public void setDirection(int direction) {
		this.direction = direction;
	}
	
	public void adjust(long total)
	{
		if(total >= 0 && rows > 0)
		{
			totalPage = ((total+rows-1) / rows);
			if(start > totalPage)
			{
				start = totalPage;
			}
			if(start < 1)
			{
				start = 1;
			}
			totalRow = total;
		}
	}
}
