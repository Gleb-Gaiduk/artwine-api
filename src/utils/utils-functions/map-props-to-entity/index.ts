const mapPropsToEntity = <Props, Entity>(
  props: Props,
  entity: Entity,
): Entity => {
  for (const [key, value] of Object.entries(props)) {
    entity[key] = value;
  }

  return entity;
};

export default mapPropsToEntity;
