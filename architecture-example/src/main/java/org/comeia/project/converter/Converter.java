package org.comeia.project.converter;

public abstract interface Converter<Entity, DTO>
{
	public default DTO from(Entity entity)
	{
		throw new UnsupportedOperationException();
	}
	
	public default Entity to(DTO dto)
	{
		return to(dto, null);
	}
	
	public default Entity to(DTO dto, Entity entity)
	{
		throw new UnsupportedOperationException();
	}
}